const fs = require('fs');
const path = require('path');
const { paths } = require('react-app-rewired');
const lessToJs = require('less-vars-to-js');
const { name } = require('./package.json');

const alias = { '@': paths.appSrc };
const theme = fs.readFileSync(path.resolve(__dirname, 'theme.less'), 'utf8');
const errNotFound = (target) => {
  throw new Error(`定位 ${target} 出错`);
};

/**
 * 设置环境变量
 * https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables
 */
process.env.REACT_APP_PLATFORM = name; // 平台

/**
 * 修改 webpack 配置
 * https://github.com/timarney/react-app-rewired
 * https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js
 */
module.exports = {
  webpack: (config) => {
    // 1. 添加 @babel/polyfill
    config.entry.unshift('@babel/polyfill');
    // 2. 添加 alias
    config.resolve.alias = { ...config.resolve.alias, ...alias };
    // 3. 启用 .eslintrc
    const eslint = config.module.rules[1].use[0];
    if (!eslint.loader.includes('eslint-loader')) errNotFound('eslint-loader');
    eslint.options = { ...eslint.options, useEslintrc: true };
    // 4. 添加 babel-plugin-import | .less 处理 | .scss 处理
    const [url, appJs, otherJs, , , sass, sassModule, file] = config.module.rules[2].oneOf;
    // babel-plugin-import
    if (!appJs.loader.includes('babel-loader')) errNotFound('babel-loader');
    const pluginImport = ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }];
    appJs.options.plugins.unshift(pluginImport);
    // .less
    if (!sass.test.toString().includes('scss|sass')) errNotFound('.scss Rule');
    sass.use[3] = {
      loader: require.resolve('less-loader'),
      options: { ...sass.use[3].options, modifyVars: lessToJs(theme), javascriptEnabled: true },
    };
    const less = { test: /\.less$/, include: paths.appNodeModules, use: sass.use };
    // .scss
    if (!sassModule.test.toString().includes('.module')) errNotFound('.module.scss Rule');
    const [, cssLoader, , sassLoader] = sassModule.use;
    cssLoader.options = { ...cssLoader.options, camelCase: 'dashes' };
    sassLoader.options = { ...sassLoader.options, data: `$platform: ${name};` };
    const newSassModule = { test: /\.scss$/, include: paths.appSrc, use: sassModule.use };
    // oneOf
    config.module.rules[2].oneOf = [url, appJs, otherJs, less, newSassModule, file];
    // 5. 删除 Service Worker
    config.plugins = config.plugins.filter((plugin) => plugin.constructor.name !== 'GenerateSW');
    return config;
  },
  resolve: { alias }, // 使 IDE 可读取到 alias（非 react-app-rewired 配置项）
};
