import fetch from '@/utils/fetch';
import { message } from 'antd';

const api = 'https://easy-mock.com/mock/5b3c7b66fd1ca96a4ed24925/costa/api/demo';
const model = {
  state: {
    // list
    typeList: [],
    queryParams: {
      demo_id: undefined,
      demo_name: undefined,
      type: null,
      status: null,
      cur_page: 1, // 当前页数
      per_page: 20, // 每页条数
    },
    listData: [],
    listTotal: 0,
    // item
    itemData: {},
  },
  actions: {
    async getTypeList() {
      const data = await fetch(`${api}/get_type_list`);
      if (data) {
        this.setState({ typeList: data.list });
      }
    },
    /**
     * list
     */
    // 获取 `listData`
    async getList() {
      const { queryParams } = this.state;
      const data = await fetch(`${api}/get_list`, { params: queryParams });
      if (data) {
        this.setState({ listData: data.demo_list, listTotal: data.total });
      }
    },
    // 点击 `查询`
    onQuery(params) {
      this.setState({ queryParams: params });
      this.getList();
    },
    // 点击 `导出`
    async onExport(params) {
      const data = await fetch(`${api}/get_list`, { params });
      if (data) {
        this.basic.showExportDot();
      }
    },
    // 切换分页
    onNav(page) {
      const { queryParams } = this.state;
      this.setState({ queryParams: { ...queryParams, cur_page: page } });
      this.getList();
    },
    // 重置 `queryParams`
    onQueryReset() {
      this.setState({
        queryParams: {
          demo_id: undefined,
          demo_name: undefined,
          demo_type: null,
          cur_page: 1, // 当前页数
          per_page: 20, // 每页条数
        },
      });
    },
    // 切换状态
    async toggleStatus(status, { demo_id }, index) {
      const data = await fetch(`${api}/toggle_status`, {
        type: 'POST',
        params: { demo_id, status },
      });
      if (data) {
        const { listData } = this.state;
        listData[index].status = status;
        this.setState({ listData });
      }
    },
    /**
     * item
     */
    // 获取 `itemData`
    async getItem(demo_id) {
      const data = await fetch(`${api}/get_item`, { params: { demo_id } });
      if (data) {
        this.setState({ itemData: data });
      }
    },
    // 重置 `itemData`
    onItemReset() {
      this.setState({ itemData: {} });
    },
    // 提交 `新建`
    async onAdd(values, backToList) {
      const data = await fetch(`${api}/add_item`, { params: values, type: 'POST' });
      if (data) {
        message.success('新增成功', 0.5, backToList());
      }
    },
    // 提交 `编辑`
    async onEdit(values, backToList) {
      const data = await fetch(`${api}/update_item`, { params: values, type: 'POST' });
      if (data) {
        message.success('更新成功', 0.5, backToList());
      }
    },
  },
};

export default model;
