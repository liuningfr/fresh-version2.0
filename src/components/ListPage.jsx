import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table } from 'antd';
import { Form } from '@/components/AntPlus';
import { listPage } from './ListPage.scss';

/**
 * ListPage - 列表页通用组件
 *
 * @param {string} [className] - 自定义 className
 * @param {object} power - 权限数据 e.g. { view: 'XXX', ctrl: null }
 * @param {object} [btnAdd] - `新建` 按钮数据 e.g. { name: '新建XXX', path: 'xxx/add' }
 * @param {node} [pageHeader] - 显示在页面顶部的元素（若 `新建` 按钮存在，则显示在右侧）
 * @param {node} [pageFooter] - 显示在页面底部的元素，默认居右
 *
 * Form
 * @param {object} form - Form.create() 注入的 `form` 对象
 * @param {array} [fields] - 表单组件集合
 * @param {object} params - 表单数据
 * @param {node} [formFooter] - 显示在 `重置` 按钮左侧的元素
 * @param {function} onReset - 重置筛选项
 * @param {function} onQuery - 根据筛选项查询
 * @param {function} onExport - 根据筛选项导出
 * @param {object} exportLoading - `导出` 时的 loading
 *
 * Table
 * @param {function} getList - 获取 Table 数据
 * @param {object} tableLoading - 获取 `data` 时的 loading
 * @param {array} columns - Table 组件 `columns`
 * @param {string} [rowKey] - 表格行的唯一标识，默认为 `id`，如有其它情况可传入
 * @param {array} data - Table 组件 `dataSource`
 * @param {number} total - 列表条目总数
 * @param {function} onNav - 切换分页时的回调函数 page => void
 */
class ListPage extends Component {
  constructor(props) {
    super(props);
    const { btnAdd, power, fields, params, total, onNav } = props;
    this.showBtnAdd = btnAdd !== undefined && power.ctrl;
    this.showToolbar = fields !== undefined;
    this.showPagination = params !== undefined && total !== undefined && onNav !== undefined;
  }
  componentDidMount() {
    const { getList, history } = this.props;
    getList();
    if (history !== undefined) {
      const { pathname: curPath } = history.location;
      history.listen(({ pathname: nextPath }) => {
        if (new RegExp(`^${curPath}`).test(nextPath)) {
          this.notReset = true;
        }
      });
    }
  }
  componentWillUnmount() {
    if (this.showToolbar && !this.notReset) {
      const { onReset } = this.props;
      onReset();
    }
  }
  // 重置表单筛选项
  onBtnReset = () => {
    const { form, onReset, getList } = this.props;
    form.resetFields();
    onReset();
    getList();
  };
  // 提交表单 (`查询` 或 `导出`)
  onSubmit = (action) => {
    const { form, params } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      const newParams =
        action === 'onQuery'
          ? { ...values, cur_page: 1, per_page: params.per_page } // onQuery
          : { ...values, is_export: 1 }; // onExport
      this.props[action](newParams);
    });
  };

  render() {
    const {
      className,
      btnAdd,
      pageHeader,
      pageFooter,
      // Form
      form,
      fields,
      params,
      formFooter,
      exportLoading,
      // Table
      tableLoading,
      columns,
      rowKey = 'id',
      data,
      total,
      onNav,
    } = this.props;
    return (
      <div className={[listPage, className].join(' ')}>
        {(this.showBtnAdd || pageHeader) && (
          <header>
            {this.showBtnAdd && (
              <Link to={btnAdd.path}>
                <Button type="primary">{btnAdd.name}</Button>
              </Link>
            )}
            {pageHeader}
          </header>
        )}
        {this.showToolbar && (
          <Form
            className="toolbar"
            api={form}
            onSubmit={() => this.onSubmit('onQuery')}
            fields={[fields].concat(
              <footer>
                {formFooter}
                <a onClick={this.onBtnReset}>重置</a>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button loading={exportLoading} onClick={() => this.onSubmit('onExport')}>
                  导出
                </Button>
              </footer>,
            )}
            data={params}
          />
        )}
        <Table
          loading={tableLoading}
          columns={columns}
          rowKey={rowKey}
          dataSource={data}
          pagination={
            this.showPagination
              ? {
                  hideOnSinglePage: true,
                  current: params.cur_page,
                  pageSize: params.per_page,
                  total,
                  onChange: onNav,
                  showTotal: (totalNum) => `共 ${totalNum} 条`,
                }
              : false
          }
        />
        {pageFooter && <footer>{pageFooter}</footer>}
      </div>
    );
  }
}

export default ListPage;
