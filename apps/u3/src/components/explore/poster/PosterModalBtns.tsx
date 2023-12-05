import styled from 'styled-components';
import { ButtonInfo, ButtonPrimary } from '../../common/button/ButtonBase';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';
import { POSTER_SHARE_DOMAIN, POSTER_SHARE_TITLE } from '../../../constants';
import { SocialPlatform } from '../../../services/social/types';
import useLogin from '../../../hooks/shared/useLogin';

export default function PosterModalBtns({
  shareDisabled,
  posterImg,
  onClose,
}: {
  shareDisabled: boolean;
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
  return (
    <Wrapper>
      <CloseBtn onClick={onClose}>
        <ChevronLeftIcon />
      </CloseBtn>
      <ShareBtn
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
            shareLink: POSTER_SHARE_DOMAIN,
            shareLinkDefaultText: POSTER_SHARE_TITLE,
            shareLinkEmbedTitle: 'Caster Daily',
            shareLinkDefaultPlatform: SocialPlatform.Farcaster,
            shareLinkEmbedImg: posterImg,
          });
        }}
      >
        Share to Farcaster
      </ShareBtn>
    </Wrapper>
  );
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
const ShareBtn = styled(ButtonPrimary)`
  width: 120px;
  height: 48px;
  flex-grow: 1;
  font-weight: 700;
`;
