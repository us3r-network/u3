/*
 * @Author:
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 10:51:29
 * @Description:
 */
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit';
import { ProfileStateProvider } from '@us3r-network/profile';
import { LinkStateProvider } from '@us3r-network/link';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import Layout from './components/layout/Index';
import { store } from './store/store';
import GlobalStyle from './GlobalStyle';

import { CERAMIC_HOST, WALLET_CONNECT_PROJECT_ID } from './constants';
import { injectStore, injectU3Token } from './services/api/request';
import U3LoginProvider from './contexts/U3LoginContext';

dayjs.extend(relativeTime);

injectStore(store);

Modal.setAppElement('#root');
function App() {
  return (
    <Us3rAuthWithRainbowkitProvider
      projectId={WALLET_CONNECT_PROJECT_ID}
      appName="Web3 Today"
    >
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
        <LinkStateProvider ceramicHost={CERAMIC_HOST}>
          <U3LoginProvider
            u3LoginSuccess={(token) => {
              injectU3Token(token);
            }}
          >
            <ReduxProvider store={store}>
              <GlobalStyle />
              <BrowserRouter>
                <Layout />
              </BrowserRouter>
            </ReduxProvider>
          </U3LoginProvider>
        </LinkStateProvider>
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}

export default App;
