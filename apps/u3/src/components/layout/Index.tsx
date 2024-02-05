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

function Layout() {
  const { ready } = useAuthentication();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const claim = searchParams.get('claim');

  useGAPageView();

  if (claim === 'true') {
    return <ClaimOnboard />;
  }

  return (
    <LayoutWrapper id="layout-wrapper">
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
        <RightBox>
          <RightInner id="layout-main-wrapper">
            {location.pathname.includes('social') ? (
              <Main />
            ) : (
              <MainBox className="main-box">
                <Main />
              </MainBox>
            )}
          </RightInner>
          <DappMenu />
        </RightBox>
      )}
      <MobileGuide />
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
    </LayoutWrapper>
  );
}
export default Layout;
const LayoutWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: #14171a;
  overflow: hidden;
  overflow-y: ${isMobile ? 'auto' : 'hidden'};
`;
const RightBox = styled.div`
  margin-left: 60px;
  height: 100%;
  // menu: 60px , dappSideBarList: 30px
  width: calc(100% - 60px - 30px);
  display: flex;
`;
const RightInner = styled.div`
  height: 100%;
  width: 0;
  flex: 1;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
`;
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
