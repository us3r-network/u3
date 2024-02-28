import { UserAvatar, UserName } from '@us3r-network/profile';
import { ComponentPropsWithRef, useState } from 'react';
import { toast } from 'react-toastify';
import useLogin from '../../hooks/shared/useLogin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '@/lib/utils';
import NavLinkItem from './NavLinkItem';
import { LogoutIcon2 } from '../common/icons/LogoutIcon';
import NotificationIcon from '../common/icons/NotificationIcon';
import BookmarkIcon from '../common/icons/BookmarkIcon';
import { ChatRoomIcon2 } from '../common/icons/ChatRoomIcon';
import SocialAccountIcon from '../common/icons/SocialAccountIcon';
import ContactUsIcon from '../common/icons/ContactUsIcon';
import EmailIcon from '../common/icons/EmailIcon';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function LoginButtonV2() {
  const { isLogin, login, logout } = useLogin();
  const [openMenu, setOpenMenu] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  if (!isLogin) {
    return (
      <ButtonWrapper onClick={login}>
        <span className="wl-user-button_no-login-text">Login</span>
      </ButtonWrapper>
    );
  }
  return (
    <>
      <LogoutConfirmModal
        isOpen={openLogoutConfirm}
        onClose={() => {
          setOpenLogoutConfirm(false);
        }}
        onConfirm={() => {
          logout();
          setOpenLogoutConfirm(false);
        }}
      />
      <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
        <DropdownMenuTrigger
          className="
          focus:outline-none focus:border-none
          active:outline-none active:border-none
        "
        >
          <ButtonWrapper
            onClick={() => {
              setOpenMenu((pre) => !pre);
            }}
          >
            <UserAvatar
              className="w-[40px] h-[40px] flex-shrink-0"
              style={{ width: '40px', height: '40px' }}
            />
            <UserName className="text-[#FFF] text-[16px] font-normal" />
          </ButtonWrapper>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn(
            'inline-flex w-[280px] box-border p-[20px] flex-col items-start gap-[20px] rounded-[20px] border-[1px] border-solid border-[#39424C] bg-[#14171A]'
          )}
          side="top"
          align="center"
          sideOffset={10}
        >
          <NavLinkItem href="/u">
            <UserAvatar
              className="w-[20px] h-[20px] flex-shrink-0"
              style={{ width: '20px', height: '20px' }}
            />
            My Profile
          </NavLinkItem>
          <NavLinkItem href="/save">
            <BookmarkIcon />
            My favorites
          </NavLinkItem>
          <NavLinkItem href="/notification">
            <NotificationIcon />
            Notifications
          </NavLinkItem>
          <NavLinkItem onClick={() => toast.info('Comming Soon')}>
            <ChatRoomIcon2 />
            Message
          </NavLinkItem>
          <NavLinkItem onClick={() => toast.info('Comming Soon')}>
            <SocialAccountIcon />
            Social Accounts
          </NavLinkItem>
          <NavLinkItem onClick={() => toast.info('Comming Soon')}>
            <EmailIcon />
            Subscribe
          </NavLinkItem>
          <NavLinkItem onClick={() => toast.info('Comming Soon')}>
            <ContactUsIcon />
            Contact us
          </NavLinkItem>
          <NavLinkItem
            onClick={(e) => {
              e.preventDefault();
              setOpenLogoutConfirm(true);
              setOpenMenu(false);
            }}
          >
            <LogoutIcon2 />
            Logout
          </NavLinkItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function ButtonWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        `    flex items-center  justify-center gap-[8px]
      text-white text-[16px] font-bold
      h-[76px] w-full p-[20px] box-border bg-[#14171A]
      outline-none border-none`,
        className
      )}
      {...props}
    />
  );
}
