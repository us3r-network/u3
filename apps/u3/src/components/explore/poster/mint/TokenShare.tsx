import { ComponentPropsWithRef, useState } from 'react';
import FarcasterIcon from '@/components/common/icons/FarcasterIcon';
import LensIcon from '@/components/common/icons/LensIcon';
import { TwitterLine } from '@/components/common/icons/twitter';
import { SocialPlatform } from '@/services/social/types';
import ColorButton from '../../../common/button/ColorButton';
import { cn } from '@/lib/utils';
import useLogin from '@/hooks/shared/useLogin';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { useGlobalModalsCtx } from '@/contexts/shared/GlobalModalsCtx';
import { useLensCtx } from '@/contexts/social/AppLensCtx';
import { tweetShare } from '@/utils/shared/twitter';

interface TokenShareProps {
  mintLink: string;
}
enum SharePlatform {
  Farcaster = SocialPlatform.Farcaster,
  Lens = SocialPlatform.Lens,
  Twitter = 'twitter',
}
export default function TokenShare({ mintLink }: TokenShareProps) {
  const { isLogin: isLoginU3, login } = useLogin();
  const {
    isConnected: isLoginFarcaster,
    currUserInfo: farcasterUserInfo,
    openFarcasterQR,
  } = useFarcasterCtx();
  const { openShareLinkModal } = useGlobalModalsCtx();

  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();

  const [platforms, setPlatforms] = useState<SharePlatform[]>([
    SharePlatform.Farcaster,
    SharePlatform.Lens,
    SharePlatform.Twitter,
  ]);
  const triggerPlatform = (platform: SharePlatform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const shareLinkModalData = {
    shareLink: mintLink,
    shareLinkDefaultText: mintLink,
  };
  return (
    <div className="flex items-center gap-[10px]">
      <span className="text-white text-[16px] font-bold leading-none">
        Share to
      </span>
      <div className="flex items-center gap-[10px]">
        <SelectOption onClick={() => triggerPlatform(SharePlatform.Farcaster)}>
          <FarcasterIcon className="w-full h-full" />
          {platforms.includes(SharePlatform.Farcaster) && <SelectedIcon />}
        </SelectOption>
        <SelectOption onClick={() => triggerPlatform(SharePlatform.Lens)}>
          <LensIcon className="w-full h-full" />
          {platforms.includes(SharePlatform.Lens) && <SelectedIcon />}
        </SelectOption>
        <SelectOption onClick={() => triggerPlatform(SharePlatform.Twitter)}>
          <TwitterLine className="w-full h-full" />
          {platforms.includes(SharePlatform.Twitter) && <SelectedIcon />}
        </SelectOption>
      </div>
      <ColorButton
        className="px-[24px] py-[10px] ml-auto"
        onClick={() => {
          const selectedFarcaster = platforms.includes(SharePlatform.Farcaster);
          const selectedLens = platforms.includes(SharePlatform.Lens);
          const selectedTwitter = platforms.includes(SharePlatform.Twitter);

          if (selectedFarcaster || selectedLens) {
            if (!isLoginU3) {
              login();
              return;
            }
            if (selectedFarcaster) {
              if (!isLoginFarcaster || !farcasterUserInfo) {
                openFarcasterQR();
                return;
              }
            }
            if (selectedLens) {
              if (!isLoginLens) {
                setOpenLensLoginModal(true);
                return;
              }
            }
            openShareLinkModal({
              ...shareLinkModalData,
              platforms: platforms as unknown as SocialPlatform[],
              onSubmitEnd: () => {
                if (selectedTwitter) {
                  tweetShare('', shareLinkModalData.shareLink);
                }
              },
            });
          } else if (selectedTwitter) {
            tweetShare('', shareLinkModalData.shareLink);
          }
        }}
      >
        Share
      </ColorButton>
    </div>
  );
}

function SelectOption({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('w-[30px] h-[30px] relative cursor-pointer', className)}
      {...props}
    />
  );
}

function SelectedIcon({ className, ...props }: ComponentPropsWithRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('absolute bottom-[-2px] right-0', className)}
      {...props}
    >
      <path
        d="M10.5 0C5.26202 0 1 4.26204 1 9.50002C1 14.7387 5.26128 19 10.5 19C15.7387 19 20 14.7387 20 9.50002C20 4.26204 15.7387 0 10.5 0ZM15.0844 7.93299L9.62692 13.4498C9.62692 13.4498 9.62286 13.4519 9.62138 13.454C9.61942 13.4553 9.61942 13.458 9.61733 13.4594C9.57375 13.5016 9.51989 13.5275 9.46944 13.5562C9.44429 13.5704 9.42379 13.5923 9.39719 13.6025C9.31544 13.6353 9.22889 13.6523 9.14225 13.6523C9.055 13.6523 8.96712 13.6353 8.88465 13.6011C8.85739 13.5896 8.83555 13.5664 8.80964 13.552C8.75921 13.5234 8.70678 13.4981 8.66309 13.4553L8.65966 13.4498C8.65833 13.4478 8.65561 13.4478 8.65424 13.4457L5.97017 10.6873C5.70777 10.4174 5.7139 9.98602 5.98379 9.72358C6.25367 9.46183 6.68444 9.46661 6.94758 9.73725L9.14703 11.9973L14.1158 6.97401C14.3803 6.7062 14.8124 6.7035 15.0796 6.9686C15.3461 7.23369 15.3488 7.6652 15.0844 7.93299Z"
        fill="#00B171"
      />
    </svg>
  );
}
