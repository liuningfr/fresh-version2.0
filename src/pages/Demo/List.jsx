import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Divider } from 'antd';
import { connect } from 'react-redux';
import { withStore } from 'retalk';
import { Input, Select } from 'antx';
import ListPage from '@/components/ListPage';

const List = ({
  power,
  location: { pathname },
  history,
  btnAdd,
  loading,
  form,
  queryParams,
  onQueryReset,
  onQuery,
  onExport, // form
  getList,
  listData,
  listTotal,
  onNav, // table
  getTypeList,
  toggleStatus,
  typeList,
}) => {
  const [activeRow, setActiveRow] = useState(null);
  const statusList = [
    { value: null, label: '全部' },
    { value: 1, label: '启用' },
    { value: 0, label: '禁用' },
  ];
  useEffect(() => {
    // 在此处请求页面需要的额外数据（除 `getList` 之外的请求）
    getTypeList();
  }, [getTypeList]);

  // table 切换 Switch 状态
  const onSwitch = (checked, row, index) => {
    setActiveRow(index);
    toggleStatus(+checked, row, index);
  };
  // Form
  const fields = () => (
    <>
      <Input label="Demo 编码" id="demo_id" rules={['number']} msg="short" />
      <Input label="Demo 名称" id="demo_name" rules={['string']} msg="short" />
      <Select
        label="分类"
        id="type"
        rules={['number']}
        msg="short"
        search
        data={[{ type_id: null, type_name: '全部' }, ...typeList]}
        keys={['type_id', 'type_name']}
      />
      <Select label="状态" id="status" rules={['number']} msg="short" data={statusList} />
    </>
  );
  // Table
  const columns = () => [
    { title: 'Demo 编码', dataIndex: 'demo_id', width: 100 },
    { title: 'Demo 名称', dataIndex: 'demo_name', width: 200 },
    { title: '分类', dataIndex: 'type', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (text, row, index) => {
        const obj = statusList.find(({ value }) => value === text);
        return (
          <Switch
            checkedChildren="已启用"
            unCheckedChildren="已禁用"
            checked={obj.value === 1}
            loading={activeRow === index && loading.toggleStatus}
            onChange={(checked) => onSwitch(checked, row, index)}
          />
        );
      },
    },
    {
      title: '操作',
      render: (text, { demo_id }) => (
        <>
          <Link to={`${pathname}/view/${demo_id}`}>查看</Link>
          {power.ctrl && (
            <>
              <Divider type="vertical" />
              <Link to={`${pathname}/edit/${demo_id}`}>编辑</Link>
            </>
          )}
        </>
      ),
      width: 100,
    },
  ];

  return (
    <ListPage
      power={power} // 页面权限 { view: '查看(无权限时为 null)', ctrl: '操作(无权限时为 null)' }
      history={history}
      btnAdd={btnAdd} // 如果 config 中配置了 `新建` 页面，会有 `btnAdd`，需要传入 ListPage
      form={form} // 表单必须
      fields={fields()} // 表单域组件集合
      params={queryParams} // 表单域数据
      onReset={onQueryReset} // 重置筛选条件
      onQuery={onQuery} // 查询
      onExport={onExport} // 导出
      exportLoading={loading.onExport} // 导出 loading
      getList={getList} // 获取 table 数据
      tableLoading={loading.getList} // 获取数据 loading
      columns={columns()} // Table 组件 `columns`
      rowKey="demo_id" // table row 唯一标识，不是 `id` 时传入
      data={listData} // 列表数据
      total={listTotal} // 列表条目总数
      onNav={onNav} // 切换分页
    />
  );
};

export default connect(...withStore('basic', 'demo'))(List);
