// import fetch from '@/utils/fetch';

const model = {
  state: {
    userInfo: {}, // 用户信息
    exportList: [], // 导出列表
    showDot: false, // 导出提示红点
    isTipVisible: false, // 导出提示信息
  },
  reducers: {
    setState(state, next) {
      return { ...state, ...next };
    },
  },
  actions: {
    // 获取用户信息
    async getUserInfo() {
      const data = { name: '刘宁' };
      if (data) {
        this.setState({ userInfo: data });
        return new Promise((resolve) => resolve(true));
      }
      return null;
    },
    // 退出登录
    async onLogout() {
      // console.log('Logout');
    },
    // 显示导出提示
    showExportDot() {
      this.setState({ showDot: false });
      this.setState({ showDot: true });
    },
    // 获取导出列表
    async getExportList() {
      this.setState({ showDot: false });
      const data = {
        tasks: [{ id: 1, export_name: '2019-4-8', create_time: '2019-4-8', status: 2 }],
      };
      if (data) {
        this.setState({ exportList: data.tasks });
      }
    },
    // 获取权限信息
    async getPower() {
      const data = true;
      if (data) {
        const powerMap = {};
        return powerMap;
      }
      return null;
    },
  },
};

export default model;
