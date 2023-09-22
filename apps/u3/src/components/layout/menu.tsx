/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 21:38:11
 * @Description: file description
 */
import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useActiveProfile } from '@lens-protocol/react-web';
import LoginButton from './LoginButton';
import Nav, {
  NavWrapper,
  PcNavItem,
  PcNavItemIconBox,
  PcNavItemTextBox,
  PcNavItemTextInner,
} from './Nav';
import { ReactComponent as LogoIconSvg } from '../imgs/logo-icon.svg';
import LogoutConfirmModal from './LogoutConfirmModal';
import useLogin from '../../hooks/useLogin';
import { useAppSelector } from '../../store/hooks';
import { selectKarmaState } from '../../features/profile/karma';
import { ReactComponent as MessageChatSquareSvg } from '../icons/svgs/message-chat-square.svg';
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx';
import MessageModal from '../message/MessageModal';
import { ReactComponent as BellSvg } from '../../route/svgs/bell.svg';
import {
  useNotificationStore,
  NotificationStoreProvider,
} from '../../contexts/NotificationStoreCtx';
import NotificationModal from '../notification/NotificationModal';
import useFarcasterCurrFid from '../../hooks/farcaster/useFarcasterCurrFid';

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
        <NotificationStoreProvider
          config={{
            fid,
            lensProfileId,
          }}
        >
          <FooterNav onlyIcon={!isOpen} />
        </NotificationStoreProvider>
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
    </MenuWrapper>
  );
}

function FooterNav({ onlyIcon }: { onlyIcon: boolean }) {
  const { openMessageModal, setOpenMessageModal } = useXmtpStore();
  const { openNotificationModal, setOpenNotificationModal } =
    useNotificationStore();

  const navItemTextInnerEls = useRef(new Map());
  const renderNavItemText = useCallback(
    (text: string) => {
      if (navItemTextInnerEls.current.has(text)) {
        const innerEl = navItemTextInnerEls.current.get(text);
        innerEl.parentElement.style.width = onlyIcon
          ? '0px'
          : `${innerEl.scrollWidth}px`;
      }
      return (
        <PcNavItemTextBox>
          <PcNavItemTextInner
            ref={(el) => {
              if (el) {
                navItemTextInnerEls.current.set(text, el);
              }
            }}
          >
            {text}
          </PcNavItemTextInner>
        </PcNavItemTextBox>
      );
    },
    [onlyIcon]
  );
  return (
    <NavWrapper>
      <PcNavItem
        isActive={openNotificationModal}
        onClick={() => {
          if (openMessageModal) setOpenMessageModal(false);
          setOpenNotificationModal((open) => !open);
        }}
      >
        <PcNavItemIconBox isActive={openNotificationModal}>
          <BellSvg />
        </PcNavItemIconBox>
        {renderNavItemText(`Notification`)}
      </PcNavItem>
      <NotificationModal />
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
    </NavWrapper>
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
