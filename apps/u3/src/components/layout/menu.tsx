/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import LoginButton from './LoginButton';
import Nav, { NavWrapper, PcNavItem, NavItemIconBox } from './Nav';
import { ReactComponent as LogoIconSvg } from '../common/assets/imgs/logo-icon.svg';
import { ReactComponent as MessageChatSquareSvg } from '../common/assets/svgs/message-chat-square.svg';
import { ReactComponent as ContactUsSvg } from '../common/assets/svgs/contact-us.svg';
import MessageModal from '../message/MessageModal';
import { NavModalName, useNav } from '../../contexts/NavCtx';
import ContactUsModal from './ContactUsModal';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
        {isOpen ? (
          <span className={'font-medium text-[24px] text-[#ffffff]'}>
            U3.XYZ
          </span>
        ) : (
          <span
            className={
              'w-[fit-content] flex px-[4px] py-[2px] items-center rounded-[22px] bg-[#454C99] text-[#ffffff] text-[10px] font-medium'
            }
          >
            Alpha
          </span>
        )}
      </LogoBox>
      <NavListBox>
        <Nav onlyIcon={!isOpen} />
      </NavListBox>

      <hr className="border-t border-[#39424C] my-4 w-full" />

      <UserChannels />

      <hr className="border-t border-[#39424C] my-4 w-full" />

      <div className="flex-grow" />

      <FooterBox>
        <NavWrapper>
          <MessageButton />
          <ContactUsButton />
        </NavWrapper>
        <LoginButtonBox>
          <LoginButton onlyIcon={!isOpen} />
        </LoginButtonBox>
      </FooterBox>
    </MenuWrapper>
  );
}

function UserChannels() {
  const { userChannels, currFid } = useFarcasterCtx();

  if (!currFid) return null;

  return (
    <div className="w-full overflow-scroll h-full flex gap-5 flex-col">
      {userChannels.map(({ parent_url }) => (
        <ChannelItem parent_url={parent_url} key={parent_url} />
      ))}
    </div>
  );
}

function ChannelItem({ parent_url }: { parent_url: string }) {
  const { getChannelFromUrl } = useFarcasterCtx();
  const navigate = useNavigate();

  const item = useMemo(() => {
    return getChannelFromUrl(parent_url);
  }, [parent_url, getChannelFromUrl]);

  if (!item) return null;

  return (
    <div
      onClick={() => {
        navigate(`/social/channel/${item.channel_id}`);
      }}
      className="cursor-pointer relative"
    >
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="rounded-md w-[40px] h-[40px]"
        />
        <div className="text-white font-bold">{item.name}</div>
      </div>
    </div>
  );
}

function ContactUsButton() {
  const { openContactUsModal, renderNavItemText, switchNavModal } = useNav();

  return (
    <>
      <PcNavItem
        isActive={openContactUsModal}
        onClick={() => {
          switchNavModal(NavModalName.ContactUs);
        }}
      >
        <NavItemIconBox isActive={openContactUsModal}>
          <ContactUsSvg />
        </NavItemIconBox>
        {renderNavItemText('Contact US')}
      </PcNavItem>
      <ContactUsModal />
    </>
  );
}

function MessageButton() {
  const { openMessageModal, renderNavItemText, switchNavModal } = useNav();

  return (
    <>
      <PcNavItem
        isActive={openMessageModal}
        onClick={() => {
          switchNavModal(NavModalName.Message);
        }}
      >
        <NavItemIconBox isActive={openMessageModal}>
          <MessageChatSquareSvg />
        </NavItemIconBox>
        {renderNavItemText('Message')}
      </PcNavItem>
      <MessageModal />
    </>
  );
}

const MenuWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '200px' : '60px')};
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
  align-items: flex-start;
`;
const LogoBox = styled.div<{ onlyIcon?: boolean }>`
  width: ${({ onlyIcon }) => (onlyIcon ? '36px' : '142px')};
  height: ${({ onlyIcon }) => (onlyIcon ? '194px' : '94px')};
  display: flex;
  flex-direction: ${({ onlyIcon }) => (onlyIcon ? 'column' : 'row')};
  gap: ${({ onlyIcon }) => (onlyIcon ? '4px' : '10px')};
  align-items: 'flex-start';
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
const NavListBox = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  align-items: start;
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
