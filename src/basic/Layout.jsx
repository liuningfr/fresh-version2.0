import React, { Component } from 'react';
import { Switch, Route, Redirect, NavLink, withRouter } from 'react-router-dom';
import { Layout as BasicLayout, Menu } from 'antd';
import Launcher from '@/components/Launcher';
// config
import config, { login } from '@/config';
// utils
import { connect } from 'react-redux';
import { withStore } from '@/store';
import getRoute from './utils/getRoute';
import useConfig from './utils/useConfig';
// components
import Path from './components/Path';
import Export from './components/Export';
import User from './components/User';
// styles
import { openLoading, loginWrapper, layout } from './Layout.scss';

const { Header, Content, Sider } = BasicLayout;

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      MenuList: [],
      bread: [],
      RouteList: [getRoute(login)],
    };
  }
  componentDidMount() {
    const {
      getUserInfo,
      location: { pathname, search },
      getPower,
      store: { addModel },
      history,
    } = this.props;
    // 获取用户信息
    getUserInfo(pathname, search)
      .then((logged) => {
        this.setState({ visible: true });
        if (!logged) return null; // 未登录
        return getPower(); // 已登录
      })
      .then((powerMap) => {
        if (!powerMap) return;
        // 设置激活的二级菜单
        this.setActiveSub(pathname);
        const { MenuList, breadMap, RouteList } = useConfig(config, powerMap, addModel);
        this.breadMap = breadMap;
        this.setState({
          MenuList,
          bread: this.getBread(pathname),
          RouteList,
        });
        // 监听 url 变化
        let curPath = pathname;
        history.listen(({ pathname: nextPath }) => {
          if (nextPath === curPath) return;
          this.setState({ bread: this.getBread(nextPath) });
          window.scrollTo(0, 0);
          const $subList = document.querySelectorAll('.ant-menu-submenu');
          Array.from($subList).forEach((sub) => sub.removeAttribute('active'));
          this.setActiveSub(nextPath);
          curPath = nextPath;
        });
      });
  }
  setActiveSub = (pathname) => {
    const $activeSub = document.querySelector(`.submenu-${pathname.split('/')[1]}`);
    if ($activeSub) $activeSub.setAttribute('active', 'active');
  };
  getBread = (pathname) => this.breadMap[pathname.match(/^\/([^\d]+\b)?/g)[0]];

  render() {
    const {
      loading,
      location: { pathname },
      exportList,
      getExportList,
      showDot,
      userInfo,
      onLogout,
    } = this.props;
    const { visible, MenuList, bread, RouteList } = this.state;

    // loading
    if (!visible) return <div className={openLoading} />;
    // 登录页
    if (pathname === '/login') {
      return (
        <div className={loginWrapper}>
          <Switch>
            {[
              <Redirect key="home" from="/" to="/login" exact />,
              ...RouteList,
              <Route key="404" render={() => <Launcher type="404" />} />,
            ]}
          </Switch>
        </div>
      );
    }
    // 运营后台（已登录）
    return (
      <BasicLayout className={layout}>
        <Sider>
          <NavLink className="logo" to="/" exact>
            Fresh
          </NavLink>
          <Menu>{MenuList}</Menu>
        </Sider>
        <Header>
          <Path list={bread} />
          <Export loading={loading} list={exportList} getList={getExportList} dot={showDot} />
          <User info={userInfo} onLogout={onLogout} />
        </Header>
        <Content>
          {loading.getPower ? (
            <Launcher type="loading" />
          ) : (
            <Switch>
              {[
                <Route key="home" render={() => <Launcher type="home" />} path="/" exact />,
                ...RouteList,
                <Route key="404" render={() => <Launcher type="404" />} />,
              ]}
            </Switch>
          )}
        </Content>
      </BasicLayout>
    );
  }
}

export default withRouter(connect(...withStore('basic'))(Layout));
