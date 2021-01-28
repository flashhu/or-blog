import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import './index.less';
import App from './App';
import store from './store';

ReactDOM.render(
  <Provider {...store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>,
  document.getElementById('root'),
);
