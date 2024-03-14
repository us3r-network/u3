import { UserAvatar, UserName } from '@us3r-network/profile';
import React, { ComponentPropsWithRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/shared/useLogin';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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
          <span className="max-sm:hidden">Login</span>
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
            <div className="flex items-center gap-4">
              <UserAvatar style={{ width: '24px', height: '24px' }} />
              <UserName className="max-sm:hidden" />
            </div>
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
          <DropdownMenuItemWarper onClick={() => navigate('/u')}>
            <UserAvatar
              className="size-4 flex-shrink-0"
              style={{ width: '20px', height: '20px' }}
            />
            My Profile
          </DropdownMenuItemWarper>

          <DropdownMenuSub>
            <DropdownMenuSubTriggerWarper>
              <SocialAccountIcon />
              Social Accounts
            </DropdownMenuSubTriggerWarper>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={cn(
                  'inline-flex w-[280px] box-border p-[20px] flex-col items-start gap-[20px] rounded-[20px] border-[1px] border-solid border-[#39424C] bg-[#14171A]'
                )}
                sideOffset={30}
              >
                <DropdownMenuItemWarper>
                  <FarcasterAccount />
                </DropdownMenuItemWarper>
                <DropdownMenuItemWarper>
                  <LensAccount />
                </DropdownMenuItemWarper>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItemWarper disabled>
            <EmailIcon />
            Subscribe
          </DropdownMenuItemWarper>

          <DropdownMenuSub>
            <DropdownMenuSubTriggerWarper>
              <ContactUsIcon />
              Contact us
            </DropdownMenuSubTriggerWarper>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={cn(
                  'inline-flex w-[280px] box-border p-[20px] flex-col items-start gap-[20px] rounded-[20px] border-[1px] border-solid border-[#39424C] bg-[#14171A]'
                )}
                sideOffset={30}
              >
                {CONTACT_LINKS.map((link) => (
                  <DropdownMenuItemWarper
                    key={link.link}
                    onClick={() => window.open(link.link, '_blank')}
                  >
                    <img
                      className="size-4"
                      src={link.iconUrl}
                      alt={link.name}
                    />
                    <span>{link.name}</span>
                  </DropdownMenuItemWarper>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItemWarper
            onClick={(e) => {
              e.preventDefault();
              setOpenLogoutConfirm(true);
              setOpenMenu(false);
            }}
          >
            <LogoutIcon2 />
            Logout
          </DropdownMenuItemWarper>
        </DropdownMenuContent>
      </DropdownMenu>
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

const DropdownMenuItemWarper = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuItem>
  // eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <DropdownMenuItem
    ref={ref}
    className={cn(
      `w-full p-[10px] box-border select-none rounded-[10px] leading-none no-underline outline-none transition-colors
         text-[#718096] text-[16px] font-medium
         flex gap-[10px] items-center`,
      `hover:bg-[#20262F]`,
      'max-sm:text-[14px]',
      className
    )}
    {...props}
  />
));

const DropdownMenuSubTriggerWarper = React.forwardRef<
  React.ElementRef<typeof DropdownMenuSubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuSubTrigger>
  // eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <DropdownMenuSubTrigger
    ref={ref}
    className={cn(
      `w-full p-[10px] box-border select-none rounded-[10px] leading-none no-underline outline-none transition-colors
         text-[#718096] text-[16px] font-medium
         flex gap-[10px] items-center`,
      `hover:bg-[#20262F]`,
      'max-sm:text-[14px]',
      className
    )}
    {...props}
  />
));
