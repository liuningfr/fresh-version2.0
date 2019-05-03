/**
 * config - 全局路由配置
 *
 * 名词介绍：
 * `list` 指列表页面（包含 form 和 table 两部分），可从侧边栏访问，
 * `item`（`list` 中的某个条目）指 `add`（新增）`view`（查看）`edit`（编辑）等页面，不显示在侧边栏
 *
 * name - 页面名称
 * path - 页面 url（`view` 与 `edit` 页面，应以 `/:id` 结尾，以传入特定条目 id）
 * file - 页面文件在 `@/pages` 中的路径
 * pageType - 若为 `add` `view` 或 `edit` 页面，需用 pageType 注明，以便使用同一个组件时，用来区分页面
 *
 * modelName - model 的命名（children 内的子页面不需要，由其父级定义）
 * modelFile - model 文件在 `@/pages` 中的路径（children 内的子页面不需要，由其父级定义）
 *
 * subMenu - 侧边栏二级菜单中的页面（list 页面）
 * children - 子页面, 如 `add` `view` `edit` 等页面，`modelName` `modelFile` 由其父级定义，自身不需要设置（item 页面）
 */
const config = [
  {
    name: '示例页面',
    icon: 'compass',
    path: 'demo',
    file: 'Demo/List',
    isHidden: false,
    modelName: 'demo',
    modelFile: 'Demo/model',
    children: [
      {
        name: '新建 Demo',
        path: 'demo/add',
        file: 'Demo/Item',
        pageType: 'add',
      },
      {
        name: '查看 Demo',
        path: 'demo/view/:id',
        file: 'Demo/Item',
        pageType: 'view',
      },
      {
        name: '编辑 Demo',
        path: 'demo/edit/:id',
        file: 'Demo/Item',
        pageType: 'edit',
      },
    ],
  },
];

export default config;

/**
 * 登录页面
 */
export const login = {
  name: '登录',
  path: '/login',
  file: 'Login/Index',
};
