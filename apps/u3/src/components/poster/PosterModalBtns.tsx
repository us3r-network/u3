import styled from 'styled-components';
import { ComponentPropsWithRef } from 'react';
import { ButtonInfo, ButtonPrimary } from '../common/button/ButtonBase';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { useGlobalModalsCtx } from '../../contexts/shared/GlobalModalsCtx';
import { POSTER_SHARE_DOMAIN } from '../../constants';
import { SocialPlatform } from '../../services/social/types';
import useLogin from '../../hooks/shared/useLogin';
import { getMetaTitle } from '../../utils/shared/html-meta';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import FarcasterIcon from '@/components/common/icons/FarcasterIcon';
import { TwitterLine } from '@/components/common/icons/twitter';
import LensIcon from '@/components/common/icons/LensIcon';
import { tweetShare } from '@/utils/shared/twitter';
import { useLensCtx } from '@/contexts/social/AppLensCtx';

export default function PosterModalBtns({
  shareDisabled,
  posterImg,
  onClose,
}: {
  shareDisabled?: boolean;
  posterImg: string;
  onClose: () => void;
}) {
  const { isLogin: isLoginU3, login } = useLogin();
  const {
    isConnected: isLoginFarcaster,
    currUserInfo: farcasterUserInfo,
    openFarcasterQR,
  } = useFarcasterCtx();
  const { openShareLinkModal } = useGlobalModalsCtx();

  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();

  const shareLinkModalData = {
    shareLink: POSTER_SHARE_DOMAIN,
    shareLinkDefaultText: '',
    shareLinkEmbedTitle: getMetaTitle(),
    shareLinkDefaultPlatform: SocialPlatform.Farcaster,
    shareLinkEmbedImg: posterImg,
    shareLinkDomain: POSTER_SHARE_DOMAIN,
  };
  return (
    <Wrapper>
      <ButtonBase onClick={onClose}>
        <ChevronLeftIcon />
      </ButtonBase>
      <ShareButton
        className=""
        disabled={shareDisabled || !posterImg}
        onClick={() => {
          if (!isLoginU3) {
            login();
            return;
          }
          if (!isLoginFarcaster || !farcasterUserInfo) {
            openFarcasterQR();
            return;
          }
          openShareLinkModal({
            ...shareLinkModalData,
            shareLinkDefaultPlatform: SocialPlatform.Farcaster,
          });
        }}
      >
        <FarcasterIcon className="w-[20px] h-[20px]" />
        Share to Farcaster
      </ShareButton>
      <ShareButton
        disabled={shareDisabled || !posterImg}
        onClick={() => {
          tweetShare('', shareLinkModalData.shareLink);
        }}
      >
        <TwitterLine className="w-[20px] h-[20px]" />
        Share to Twitter
      </ShareButton>
      <ShareButton
        disabled={shareDisabled || !posterImg}
        onClick={() => {
          if (!isLoginU3) {
            login();
            return;
          }
          if (!isLoginLens) {
            setOpenLensLoginModal(true);
            return;
          }
          openShareLinkModal({
            ...shareLinkModalData,
            shareLinkDefaultPlatform: SocialPlatform.Lens,
          });
        }}
      >
        <LensIcon className="w-[20px] h-[20px]" />
        Share to Lens
      </ShareButton>
      <ButtonBase
        className="px-[24px] bg-[linear-gradient(90deg,_#CD62FF_0%,_#62AAFF_100%)]"
        disabled
      >
        Free Mint
      </ButtonBase>
    </Wrapper>
  );
}

function ButtonBase({ className, ...props }: ComponentPropsWithRef<'button'>) {
  return (
    <Button
      className={cn(
        'bg-white h-[48px] p-[12px] gap-[8px] rounded-[12px] text-black text-[16px] font-bold',
        'hover:bg-white hover:text-black',
        className
      )}
      {...props}
    />
  );
}

function ShareButton({ className, ...props }: ComponentPropsWithRef<'button'>) {
  return <ButtonBase className={cn('flex-1', className)} {...props} />;
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
const Wrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const CloseBtn = styled(ButtonInfo)`
  width: 50px;
  height: 48px;
  flex-grow: 0.1 !important;
`;
