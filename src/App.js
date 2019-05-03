import React from 'react';
// localization
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
// router
import { BrowserRouter } from 'react-router-dom';
// store
import { Provider } from 'react-redux';
import { createStore } from '@/store';
import basic from './basic/model';
// components
import Layout from './basic/Layout';

const store = createStore({ basic });

const App = () => (
  <LocaleProvider locale={zhCN}>
    <BrowserRouter basename="/manage">
      <Provider store={store}>
        <Layout store={store} />
      </Provider>
    </BrowserRouter>
  </LocaleProvider>
);

export default App;
