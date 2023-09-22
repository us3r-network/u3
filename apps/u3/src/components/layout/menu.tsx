/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 21:38:11
 * @Description: file description
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '@lens-protocol/react-web';
import { useState } from 'react';
import LoginButton from './LoginButton';
import Nav, { NavWrapper, PcNavItem, PcNavItemIconBox } from './Nav';
import { ReactComponent as LogoIconSvg } from '../imgs/logo-icon.svg';
// import LogoutConfirmModal from './LogoutConfirmModal';
// import useLogin from '../../hooks/useLogin';
import { useAppSelector } from '../../store/hooks';
import { selectKarmaState } from '../../features/profile/karma';
import { ReactComponent as MessageChatSquareSvg } from '../icons/svgs/message-chat-square.svg';
import MessageModal from '../message/MessageModal';
import { ReactComponent as BellSvg } from '../../route/svgs/bell.svg';
import {
  useNotificationStore,
  NotificationStoreProvider,
} from '../../contexts/NotificationStoreCtx';
import {
  useNotificationStore as useNotificationStoreNoLens,
  NotificationStoreProvider as NotificationStoreProviderNoLens,
} from '../../contexts/NotificationStoreCtx_NoLens';
import NotificationModal from '../notification/NotificationModal';
import NotificationModalNoLens from '../notification/NotificationModal_NoLens';
import useFarcasterCurrFid from '../../hooks/farcaster/useFarcasterCurrFid';
import { NavProvider, useNav } from '../../contexts/NavCtx';

export default function Menu() {
  // const { logout } = useLogin();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  // const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const { totalScore } = useAppSelector(selectKarmaState);

  const { data: lensProfile } = useActiveProfile();
  const lensProfileId = lensProfile?.id;
  const fid = Number(useFarcasterCurrFid());
  console.log({ lensProfileId, fid });

  return (
    <MenuWrapper
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <NavProvider>
        <LogoBox onlyIcon={!isOpen} onClick={() => navigate('/')}>
          <LogoIconBox onlyIcon={!isOpen}>
            <LogoIconSvg />
          </LogoIconBox>

          <LogoText>Alpha</LogoText>
        </LogoBox>
        <NavListBox>
          <Nav onlyIcon={!isOpen} />
        </NavListBox>
        <FooterBox>
          {/* TODO: 这里使用了非常不优雅的做法，因为在没有拿到Lens
        Profile的情况下，无法使用Lens的useUnreadLensNotificationCount，所以这里使用了两套Notification组件，
        等Lens Hooks V2这里需要重构 */}
          <NavWrapper>
            {lensProfileId ? (
              <NotificationStoreProvider
                config={{
                  fid,
                  lensProfileId,
                }}
              >
                <NotificationButton />
              </NotificationStoreProvider>
            ) : (
              fid > 0 && (
                <NotificationStoreProviderNoLens
                  config={{
                    fid,
                  }}
                >
                  <NotificationButtonNoLens />
                </NotificationStoreProviderNoLens>
              )
            )}
            <MessageButton />
          </NavWrapper>
          <LoginButtonBox>
            <LoginButton
              onlyIcon={!isOpen}
              // onLogout={() => {
              //   setOpenLogoutConfirm(true);
              // }}
              karmaScore={totalScore}
            />
          </LoginButtonBox>
        </FooterBox>
        {/* <LogoutConfirmModal
        isOpen={openLogoutConfirm}
        onClose={() => {
          setOpenLogoutConfirm(false);
        }}
        onConfirm={() => {
          logout();
          setOpenLogoutConfirm(false);
        }}
        onAfterOpen={() => {
          setIsOpen(false);
        }}
      /> */}
      </NavProvider>
    </MenuWrapper>
  );
}

function MessageButton() {
  const {
    openMessageModal,
    setOpenMessageModal,
    openNotificationModal,
    setOpenNotificationModal,
    renderNavItemText,
  } = useNav();

  return (
    <>
      <PcNavItem
        isActive={openMessageModal}
        onClick={() => {
          if (openNotificationModal) setOpenNotificationModal(false);
          setOpenMessageModal((open) => !open);
        }}
      >
        <PcNavItemIconBox isActive={openMessageModal}>
          <MessageChatSquareSvg />
        </PcNavItemIconBox>
        {renderNavItemText('Message')}
      </PcNavItem>
      <MessageModal />
    </>
  );
}

function NotificationButton() {
  const {
    openMessageModal,
    setOpenMessageModal,
    openNotificationModal,
    setOpenNotificationModal,
    renderNavItemText,
  } = useNav();
  const { unreadCount, clearUnread } = useNotificationStore();

  return (
    <>
      <PcNavItem
        isActive={openNotificationModal}
        onClick={() => {
          if (openMessageModal) setOpenMessageModal(false);
          if (unreadCount && !openNotificationModal) clearUnread();
          setOpenNotificationModal((open) => !open);
        }}
      >
        <PcNavItemIconBox isActive={openNotificationModal}>
          <BellSvg fill={unreadCount && 'red'} />
        </PcNavItemIconBox>
        {renderNavItemText(`Notification(${unreadCount})`)}
      </PcNavItem>

      <NotificationModal />
    </>
  );
}

function NotificationButtonNoLens() {
  const {
    openMessageModal,
    setOpenMessageModal,
    openNotificationModal,
    setOpenNotificationModal,
    renderNavItemText,
  } = useNav();
  const { unreadCount, clearUnread } = useNotificationStoreNoLens();

  return (
    <>
      <PcNavItem
        isActive={openNotificationModal}
        onClick={() => {
          if (openMessageModal) setOpenMessageModal(false);
          if (unreadCount && !openNotificationModal) clearUnread();
          setOpenNotificationModal((open) => !open);
        }}
      >
        <PcNavItemIconBox isActive={openNotificationModal}>
          <BellSvg fill={unreadCount && 'red'} />
        </PcNavItemIconBox>
        {renderNavItemText(`Notification(${unreadCount})`)}
      </PcNavItem>
      <NotificationModalNoLens />
    </>
  );
}

const MenuWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '180px' : '60px')};
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 20px 10px;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  transition: all 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 20;
  justify-content: space-between;
  align-items: flex-start;
`;
const LogoBox = styled.div<{ onlyIcon?: boolean }>`
  width: ${({ onlyIcon }) => (onlyIcon ? '36px' : '142px')};
  display: flex;
  gap: 10px;
  align-items: flex-end;
  overflow: hidden;
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const LogoIconBox = styled.div<{ onlyIcon?: boolean }>`
  width: 36px;
  height: 36px;
  path {
    transition: all 0.3s ease-out;
  }
  ${({ onlyIcon }) =>
    onlyIcon &&
    `path {
      fill: #fff;
    }
  `};
`;
const LogoText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
const NavListBox = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
`;
const FooterBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
`;
const LoginButtonBox = styled.div`
  width: 100%;
  transition: all 0.3s ease-out;
`;
// const UnreadCountBadge = styled.div`
//   width: 6px;
//   height: 6px;
//   border-radius: 50%;
//   background-color: red;
//   font-size: 10px;
//   color: #fff;
//   position: absolute;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
