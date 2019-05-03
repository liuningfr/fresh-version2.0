import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStore } from 'retalk';
import { Input, Select, AutoComplete, Transfer, Cascader } from 'antx';
import ItemPage from '@/components/ItemPage';

class Item extends Component {
  constructor(props) {
    super(props);
    const { pageType } = props;
    this.msg = pageType === 'view' ? '' : 'full';
    this.statusList = [{ value: 1, label: '启用' }, { value: 0, label: '禁用' }];
  }
  componentDidMount() {
    // 在此处请求页面需要的额外数据（除 `getItem` 之外的请求）
    const { getTypeList } = this.props;
    getTypeList();
  }
  // Form
  fields = () => {
    const { typeList } = this.props;
    return (
      <>
        <h3>基础信息</h3>
        <Input label="Demo 编码" id="demo_id" rules={['required', 'number']} msg={this.msg} />
        <Input label="Demo 名称" id="demo_name" rules={['required', 'string']} msg={this.msg} />
        <Select
          label="类型"
          id="type"
          rules={['string', 'required']}
          msg={this.msg}
          data={typeList}
          keys={['type_id', 'type_name']}
          search
        />
        <Select label="状态" id="status" rules={['number']} msg={this.msg} data={this.statusList} />
        <h3>其它封装的 AntPlus 组件示例</h3>
        <AutoComplete
          label="AutoComplete 1"
          id="auto_complete_1"
          rules={['required', 'string']}
          data={['12345', '23456', '34567']}
          msg={this.msg}
        />
        <AutoComplete
          label="AutoComplete 2"
          id="auto_complete_2"
          rules={['string']}
          msg={this.msg}
          data={[{ value: 123, text: '第一个' }, { value: 456, text: '第二个' }]}
        />
        <Transfer
          label="Transfer"
          id="transfer"
          rules={['required', 'array']}
          search
          searchMsg={this.msg}
          data={[{ key: 123, title: '第一个' }, { key: 456, title: '第二个' }]}
          initialValue={[123]}
        />
        <Cascader
          label="Cascader 1"
          id="cascader_1"
          rules={['required', 'array']}
          search
          msg={this.msg}
          keys={['key', 'label']}
          data={[
            { key: 123, label: '第一个', children: [{ key: 234, label: '第一个下的第一个' }] },
            { key: 456, label: '第二个' },
          ]}
          initialValue={[123, 234]}
        />
        <Cascader
          label="Cascader 2"
          id="cascader_2"
          rules={['required', 'array']}
          search
          msg={this.msg}
          data={[
            { value: 123, label: '第一个', children: [{ value: 234, label: '第一个下的第一个' }] },
            { value: 456, label: '第二个' },
          ]}
          initialValue={[123, 234]}
        />
      </>
    );
  };

  render() {
    const {
      pageType,
      listPath,
      getItem,
      match,
      loading,
      onItemReset,
      form,
      itemData,
      onAdd,
      onEdit,
      history,
    } = this.props;

    return (
      <ItemPage
        pageType={pageType} // 页面类型，必须，可为 `add` `view` `edit`
        listPath={listPath} // 父页面路径，用于跳转
        getItem={getItem} // 获取表单数据
        match={match} // withRouter 注入，用于获取 url 中的 id
        loading={loading.getItem} // 获取数据 loading
        onReset={onItemReset} // 重置表单数据
        form={form} // 表单必须
        formCols={2} // 每行列数
        fields={this.fields()} // 表单域组件集合
        disabledFields={{ edit: ['demo_name'] }} // 禁用的表单域（数据可能是由其它表单域输入自动获取）
        data={itemData} // 表单数据
        onAdd={onAdd} // 提交新建
        onEdit={onEdit} // 提交编辑
        history={history} // withRouter 注入，用于提交成功时跳转页面
      />
    );
  }
}

export default connect(...withStore('basic', 'demo'))(Item);
