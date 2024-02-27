/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-30 09:28:04
 * @Description: 站点布局入口
 */
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { isMobile } from 'react-device-detect';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuthentication } from '@us3r-network/auth-with-rainbowkit';
import { ComponentPropsWithRef } from 'react';
import { MEDIA_BREAK_POINTS } from '../../constants/index';
import Main from './Main';
import { useGAPageView } from '../../hooks/shared/useGoogleAnalytics';
import Menu from './menu';
import DappMenu from '../dapp/launcher/DappMenu';
import MobileHeader from './mobile/MobileHeader';
import MobileNav from './mobile/MobileNav';
import { MobileGuide } from './mobile/MobileGuide';
import AddPostMobile from '../social/AddPostMobile';
import ClaimOnboard from '../onboard/Claim';
import RedEnvelopeFloatingWindow from '../social/frames/red-envelope/RedEnvelopeFloatingWindow';
import { cn } from '@/lib/utils';

function Layout() {
  const { ready } = useAuthentication();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const claim = searchParams.get('claim');

  useGAPageView();

  return (
    <div
      id="layout-wrapper"
      className="w-screen h-screen bg-[#14171a] overflow-x-hidden"
    >
      {ready ? isMobile ? <MobileHeader /> : <Menu /> : null}
      {ready && isMobile ? <MobileNav /> : null}
      {isMobile ? (
        <MobileContentBox>
          <Main />
          <div className="fixed right-[20px] bottom-[80px]">
            <AddPostMobile />
          </div>
        </MobileContentBox>
      ) : (
        <div className="ml-[60px] h-full w-[calc(100vw-60px-30px)] bg-[#20262F] overflow-hidden">
          <div
            id="layout-main-wrapper"
            className="h-full flex-[1] box-border overflow-y-auto overflow-x-hidden"
          >
            <Main />
          </div>
          <DappMenu />
          <RedEnvelopeFloatingWindow />
        </div>
      )}
      <MobileGuide />
      {claim === 'true' && <ClaimOnboard />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
export default Layout;

export const MainBox = styled.div`
  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc(${MEDIA_BREAK_POINTS.xxxl}px - 60px);
  }
  /* height: 100%; */
  margin: 0 auto;
`;

export const MainWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  @media (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    width: ${MEDIA_BREAK_POINTS.xl}px;
  }
  ${isMobile &&
  `
    padding: 10px;
    height: calc(100vh - 56px);
    @media (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
      width: 100%;
    }
  `}
`;

/**
 * mobile styles
 */
const MobileContentBox = styled.div`
  margin-top: 60px;
  width: 100%;
`;
