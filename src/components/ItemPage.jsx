import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import Launcher from '@/components/Launcher';
import { Form } from '@/components/AntPlus';

/**
 * ItemPage - `新建` `查看` `编辑` 页通用组件
 *
 * @param {string} [className] - 自定义 className
 * @param {number} [formCols] - 表单分为几列 (默认为 1 列，支持 2、3、4 列三种情况)
 * @param {string} pageType - 页面类型 e.g. `add` `view` `edit`
 * @param {string} listPath - 对应父级页面 url
 *
 * @param {function} getItem - 获取表单数据
 * @param {object} match - withRouter() 注入的 `match` 对象
 * @param {object} loading - 获取表单数据的 loading
 * @param {function} onReset - 重置表单数据
 *
 * @param {object} form - Form.create() 注入的 `form` 对象
 * @param {array} fields - 表单组件集合
 * @param {object} [disabledFields] - e.g. { add: []，edit: [] } (add & edit 页禁用的表单域)
 * @param {object} data - 表单数据
 * @param {function} onAdd - 提交新建，(values, backToList, form) => void
 * @param {function} onEdit - 提交编辑，(values, backToList, form) => void
 * @param {function} onUpload - 提交编辑，(values, backToList, form) => void
 * @param {object} history - withRouter() 注入的 `history` 对象
 */

class ItemPage extends Component {
  constructor(props) {
    super(props);
    const { formCols } = props;
    this.formColsClass = typeof formCols === 'number' ? `form-with-${formCols}-cols` : '';
  }
  componentDidMount() {
    const { pageType } = this.props;
    // 若为 `新建` 或 `编辑` 页面, 初始化表单数据
    if (pageType === 'view' || pageType === 'edit') {
      const {
        getItem,
        match: {
          params: { id },
        },
      } = this.props;
      getItem(id);
    }
  }
  componentWillUnmount() {
    // 重置表单数据
    const { onReset } = this.props;
    if (onReset) {
      onReset();
    }
  }
  onSubmit = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (values.distribution_scope) {
        values.distribution_scope = parseFloat(values.distribution_scope).toFixed(2);
      }
      if (values.logistics_type === undefined) {
        values.logistics_type = 0;
      }
      if (err) return;
      const { history, listPath, pageType } = this.props;
      const backToList = () => history.push(listPath);
      // 调用 model 中的 `onAdd` 或 `onEdit`
      listPath && this.props[pageType === 'add' ? 'onAdd' : 'onEdit'](values, backToList, form);
    });
  };
  disabledFields = () => {
    const { pageType } = this.props;
    if (pageType === 'view') return 'all'; // view 页面
    const { disabledFields } = this.props;
    if (!disabledFields) return null;
    if (pageType === 'add') return disabledFields.add; // add 页面
    if (pageType === 'edit') return disabledFields.edit; // edit 页面
    return null;
  };

  render() {
    const { className, pageType, listPath, loading, form, fields, data, onUpload } = this.props;
    return (
      <Fragment>
        {loading && <Launcher type="loading" />}
        <Form
          className={['item-page', pageType, this.formColsClass, className].join(' ')}
          style={{ display: loading ? 'none' : 'flex' }}
          api={form}
          onSubmit={pageType === 'view' ? null : this.onSubmit}
          fields={[fields].concat(
            <footer>
              {listPath ? (
                pageType === 'view' ? (
                  <Link to={listPath}>
                    <Button type="primary">返回</Button>
                  </Link>
                ) : (
                  <Fragment>
                    <Link to={listPath}>
                      <Button>取消</Button>
                    </Link>
                    <Button type="primary" htmlType="submit">
                      确认
                    </Button>
                  </Fragment>
                )
              ) : (
                <Fragment>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={() => {
                      onUpload(this.props.fileList);
                    }}
                  >
                    确认
                  </Button>
                </Fragment>
              )}
            </footer>,
          )}
          disabledFields={this.disabledFields()}
          data={data}
          colon={pageType === 'view'}
        />
      </Fragment>
    );
  }
}

export default ItemPage;
