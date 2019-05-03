import React, { Component } from 'react';
import { Modal, Button, message } from 'antd';
import { Form, Input } from '@/components/AntPlus';
import getQuery from '@/utils/getQuery';
import { login, modal } from './Index.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: null,
      token: null,
    };
  }
  componentDidMount() {
    const { userInfo } = this.props;
    if (userInfo.name === undefined) this.getPicCode();
  }
  // 点击 `登录`
  onSubmit = () => {
    const { form, sdk } = this.props;
    form.validateFields(async (err, values) => {
      if (err && (err.username || err.password || err.captcha)) return;
      const { username, password, captcha } = values;
      sdk.loginPwd(
        username,
        password,
        captcha,
        this.successLogin,
        this.fail,
        this.getPicCode,
        this.risk,
      );
    });
  };
  // 提交弹窗
  onOk = () => {
    const { form, sdk } = this.props;
    form.validateFields(async (err, values) => {
      if (err && err.newPassword) return;
      const { newPassword } = values;
      const { token } = this.state;
      sdk.setPwd(newPassword, token, this.successSetPassword, this.expired, this.fail);
    });
  };
  // 关闭弹窗
  onCancel = () => {
    this.setState({ token: null });
  };
  // 获取图片验证码
  getPicCode = () => {
    const { sdk } = this.props;
    sdk.refreshCaptcha(({ url }) => this.setState({ url }), { color: '000000' });
  };
  // 登录成功
  successLogin = () => {
    const {
      location: { search },
    } = this.props;
    const redirectUrl = decodeURIComponent(getQuery(search).url || '/');
    window.location.replace(`/manage${redirectUrl}`);
  };
  // 重置 STOKEN
  resetStoken = () => {
    const { sdk } = this.props;
    sdk.getStoken(this.successLogin, this.fail);
  };
  // 设置密码成功
  successSetPassword = () => {
    message.success('设置密码成功，请使用新密码登录');
    this.setState({ token: null });
  };
  // 失败
  fail = ({ errmsg }) => {
    message.warn(errmsg);
  };
  // 用户密码处于危险状态（例如自动生成的初始密码）
  risk = ({ errmsg, token }) => {
    message.warn(errmsg);
    this.setState({ token });
  };
  // token 过期
  expired = ({ errmsg }) => {
    message.warn(`${errmsg}，请重新登录`);
    this.setState({ token: null });
  };

  render() {
    const { form, userInfo, onLogout } = this.props;
    const { url, token } = this.state;
    return (
      <div className={login}>
        <h1>运营后台</h1>
        {userInfo.name === undefined ? (
          <Form api={form} onSubmit={this.onSubmit}>
            <Input label="用户名" id="username" rules={['required']} msg="手机号 / 用户名" />
            <Input label="密码" id="password" rules={['required']} msg="密码" type="password" />
            <div className="captcha-wrapper">
              <Input label="验证码" id="captcha" rules={['required']} msg="验证码" />
              <a onClick={this.getPicCode}>
                {url && <img src={url} alt="验证码" title="点击更换验证码" />}
              </a>
            </div>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form>
        ) : (
          <div className="logged">
            <h4>系统检测到您已登录账号</h4>
            <div className="logged-user">用户名：{userInfo.name}</div>
            <Button type="primary" onClick={this.resetStoken}>
              使用此账号登录
            </Button>
            <a onClick={() => onLogout(this.getPicCode)}>使用其它账号登录{'>'}</a>
          </div>
        )}
        <Modal
          visible={token !== null}
          onOk={this.onOk}
          onCancel={this.onCancel}
          wrapClassName={modal}
          width={400}
          title="设置新密码"
        >
          {token !== null && (
            <Form api={form}>
              <Input
                label="新密码"
                id="newPassword"
                rules={['required']}
                msg="新密码"
                type="password"
              />
            </Form>
          )}
        </Modal>
      </div>
    );
  }
}

export default Login;
