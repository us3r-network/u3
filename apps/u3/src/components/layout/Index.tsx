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
import { useLocation, useSearchParams } from 'react-router-dom';
import { ComponentPropsWithRef } from 'react';
import { MEDIA_BREAK_POINTS } from '../../constants/index';
import Main from './Main';
import { useGAPageView } from '../../hooks/shared/useGoogleAnalytics';
import Menu from './menu';
import DappMenu from '../dapp/launcher/DappMenu';
import MobileMainNav from './mobile/MobileMainNav';
import { MobileGuide } from './mobile/MobileGuide';
import ClaimOnboard from '../onboard/Claim';
import RedEnvelopeFloatingWindow from '../social/frames/red-envelope/RedEnvelopeFloatingWindow';
import { cn } from '@/lib/utils';
import { isCommunityPath } from '@/route/path';

function Layout() {
  const [searchParams, setSearchParams] = useSearchParams();
  const claim = searchParams.get('claim');
  const { pathname } = useLocation();
  const isCommunity = isCommunityPath(pathname);

  useGAPageView();

  return (
    <div
      id="layout-wrapper"
      className="w-screen h-screen bg-[#14171a] overflow-x-hidden overflow-y-auto flex"
    >
      <Menu
        className={cn(
          '',
          !isCommunity ? 'max-sm:hidden' : ' max-sm:h-[calc(100vh-80px)]'
        )}
      />
      <DappMenu />
      <Main
        className={cn(
          'h-full w-[calc(100vw-60px-30px)] bg-[#20262F] box-border overflow-y-auto overflow-x-hidden',
          'max-sm:ml-0 max-sm:w-full max-sm:h-[calc(100vh-80px)]',
          isCommunity ? 'max-sm:w-[calc(100vw-60px)]' : ''
        )}
        id="layout-main-wrapper"
      />
      <MobileMainNav />
      <RedEnvelopeFloatingWindow />
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

export function MainWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'w-full min-h-full h-auto p-[24px] box-border overflow-y-auto overflow-x-hidden flex flex-col gap-[40px]',
        'max-sm:gap-[20px] max-sm:p-[10px]',
        className
      )}
      {...props}
    />
  );
}
