/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-01 10:00:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-12 17:31:50
 * @Description: file description
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import loadable from '@loadable/component';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import LoadableFallback from './components/layout/LoadableFallback';
// import ExternalLinkRiskWarning, {
//   isExternalLinkRiskWarningUrl,
//   startExternalLinkNavigationListener,
// } from './ExternalLinkRiskWarning';

// 当前地址是否是外链警告地址，不是的话开启外链跳转监听器
// if (!isExternalLinkRiskWarningUrl) {
//   startExternalLinkNavigationListener();
// }

const App = loadable(() => import(`./App`), {
  fallback: <LoadableFallback />,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* {isExternalLinkRiskWarningUrl ? <ExternalLinkRiskWarning /> : <App />} */}
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
