import { UserAvatar, UserName } from '@us3r-network/profile';
import React, { ComponentPropsWithRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/shared/useLogin';
import {
  Drawer,
  DrawerContent,
  DrawerPortal,
  DrawerTrigger,
} from '../ui/drawer';
import { cn } from '@/lib/utils';
import { LogoutIcon2 } from '../common/icons/LogoutIcon';
import SocialAccountIcon from '../common/icons/SocialAccountIcon';
import ContactUsIcon from '../common/icons/ContactUsIcon';
import EmailIcon from '../common/icons/EmailIcon';
import LogoutConfirmModal from './LogoutConfirmModal';
import feedbackIconUrl from '../common/assets/platform/pngs/feedback.png';
import telegramIconUrl from '../common/assets/platform/pngs/telegram.png';
import twitterIconUrl from '../common/assets/platform/pngs/twitter.png';
import discordIconUrl from '../common/assets/platform/pngs/discord.png';
import warpcastIconUrl from '../common/assets/platform/svgs/warpcast.svg';
import { CONTACT_US_LINKS } from '@/constants';
import {
  FarcasterAccount,
  LensAccount,
} from '../profile/info/PlatformAccounts';
import LoginIcon from './nav-icons/LoginIcon';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';

const CONTACT_LINKS = [
  {
    link: CONTACT_US_LINKS.feedback,
    iconUrl: feedbackIconUrl,
    name: 'Feedback',
  },
  {
    link: CONTACT_US_LINKS.farcaster,
    iconUrl: warpcastIconUrl,
    name: 'Farcaster',
  },
  {
    link: CONTACT_US_LINKS.discord,
    iconUrl: discordIconUrl,
    name: 'Discord',
  },
  {
    link: CONTACT_US_LINKS.twitter,
    iconUrl: twitterIconUrl,
    name: 'Twitter',
  },
  {
    link: CONTACT_US_LINKS.telegram,
    iconUrl: telegramIconUrl,
    name: 'Telegram',
  },
];

export default function LoginButtonV2Mobile() {
  const { isLogin, login, logout } = useLogin();
  const [openMenu, setOpenMenu] = useState(false);
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  if (!isLogin) {
    return (
      <ButtonWrapper onClick={login}>
        <div className="flex items-center gap-4">
          <LoginIcon />
        </div>
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
      <Drawer open={openMenu} onOpenChange={setOpenMenu}>
        <DrawerTrigger
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
            <div className="flex items-center gap-4">
              <UserAvatar style={{ width: '32px', height: '32px' }} />
            </div>
          </ButtonWrapper>
        </DrawerTrigger>
        <DrawerContent
          className={cn(
            'inline-flex w-full box-border p-[20px] flex-col items-start gap-4 rounded-[20px] border-[1px] border-solid border-[#39424C] bg-[#14171A]'
          )}
        >
          <ItemWarper onClick={() => navigate('/u')}>
            <UserAvatar
              className="size-4 flex-shrink-0"
              style={{ width: '20px', height: '20px' }}
            />
            My Profile
          </ItemWarper>
          <Collapsible className="w-full">
            <CollapsibleTrigger asChild className="w-full">
              <ItemWarper>
                <SocialAccountIcon />
                Social Accounts
              </ItemWarper>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full px-4 gap-2">
              <ItemWarper
                onClick={() => {
                  setOpenMenu(false);
                }}
              >
                <FarcasterAccount />
              </ItemWarper>
              <ItemWarper
                onClick={() => {
                  setOpenMenu(false);
                }}
              >
                <LensAccount />
              </ItemWarper>
            </CollapsibleContent>
          </Collapsible>

          <ItemWarper>
            <EmailIcon />
            Subscribe
          </ItemWarper>

          <Collapsible className="w-full">
            <CollapsibleTrigger className="w-full">
              <ItemWarper>
                <ContactUsIcon />
                Contact us
              </ItemWarper>
            </CollapsibleTrigger>
            <CollapsibleContent className="w-full px-4 gap-2">
              {CONTACT_LINKS.map((link) => (
                <ItemWarper
                  key={link.link}
                  onClick={() => window.open(link.link, '_blank')}
                >
                  <img className="size-4" src={link.iconUrl} alt={link.name} />
                  <span>{link.name}</span>
                </ItemWarper>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <ItemWarper
            onClick={(e) => {
              e.preventDefault();
              setOpenLogoutConfirm(true);
              setOpenMenu(false);
            }}
          >
            <LogoutIcon2 />
            Logout
          </ItemWarper>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function ButtonWrapper({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `flex items-center justify-between
        text-white text-[16px] font-bold
        sm:h-[76px] sm:w-full sm:p-[20px] box-border
        outline-none border-none`,
        className
      )}
      {...props}
    />
  );
}

function ItemWarper({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `w-full p-[10px] box-border select-none rounded-[10px] leading-none no-underline outline-none transition-colors
         text-[#718096] text-[16px] font-medium
         flex gap-[10px] items-center`,
        className
      )}
      {...props}
    />
  );
}
