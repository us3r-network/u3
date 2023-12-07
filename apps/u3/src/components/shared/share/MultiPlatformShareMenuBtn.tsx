import { useRef, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { toast } from 'react-toastify';
import { WARPCAST_HOST } from 'src/utils/social/farcaster/getFarcasterExternalLink';
import { HEY_HOST } from 'src/utils/social/lens/getLensExternalLink';
import PopoverBase, {
  PopoverBaseProps,
} from '../../common/popover/PopoverBase';
import CopyIcon from '../../common/icons/CopyIcon';
import { TwitterLine } from '../../common/icons/twitter';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import { Share } from '../../common/icons/share';
import FarcasterIcon from '../../common/icons/FarcasterIcon';
import LensIcon from '../../common/icons/LensIcon';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import { tweetShare } from '../../../utils/shared/twitter';
import { useGlobalModalsCtx } from '../../../contexts/shared/GlobalModalsCtx';
import { SocialPlatform } from '../../../services/social/types';

interface MultiPlatformShareMenuBtnProps
  extends StyledComponentPropsWithRef<'button'> {
  shareLink: string;
  offialUrl?: string;
  shareLinkDefaultText: string;
  shareLinkEmbedTitle: string;
  popoverConfig?: Omit<PopoverBaseProps, 'children'>;
}
export function MultiPlatformShareMenuBtn({
  shareLink,
  offialUrl,
  shareLinkDefaultText,
  shareLinkEmbedTitle,
  popoverConfig,
  ...btnProps
}: MultiPlatformShareMenuBtnProps) {
  const {
    isConnected: isLoginFarcaster,
    currUserInfo: farcasterUserInfo,
    openFarcasterQR,
  } = useFarcasterCtx();
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const menuTriggerRef = useRef(null);

  const { openShareLinkModal } = useGlobalModalsCtx();
  return (
    <>
      <MenuBtn
        ref={menuTriggerRef}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpenMenu(true);
        }}
        {...btnProps}
      >
        <Share />
      </MenuBtn>
      <PopoverBase
        placement="bottom end"
        offset={-5}
        triggerRef={menuTriggerRef}
        isOpen={isOpenMenu}
        onOpenChange={setIsOpenMenu}
        {...popoverConfig}
      >
        <MenuWrapper>
          <MenuOption
            onClick={() => {
              if (!isLoginFarcaster || !farcasterUserInfo) {
                openFarcasterQR();
                return;
              }
              openShareLinkModal({
                shareLink,
                shareLinkDefaultText,
                shareLinkEmbedTitle,
                shareLinkDefaultPlatform: SocialPlatform.Farcaster,
              });
            }}
          >
            <FarcasterIcon />
            <MenuOptionText>Share to Farcaster</MenuOptionText>
          </MenuOption>
          <MenuOption
            onClick={() => {
              if (!isLoginLens) {
                setOpenLensLoginModal(true);
                return;
              }
              openShareLinkModal({
                shareLink,
                shareLinkDefaultText,
                shareLinkEmbedTitle,
                shareLinkDefaultPlatform: SocialPlatform.Lens,
              });
            }}
          >
            <LensIcon />
            <MenuOptionText>Share to Lens</MenuOptionText>
          </MenuOption>
          <MenuOption
            onClick={() => {
              tweetShare(shareLinkDefaultText, shareLink);
            }}
          >
            <TwitterLine />
            <MenuOptionText>Share to Twitter</MenuOptionText>
          </MenuOption>
          <MenuOption
            onClick={async () => {
              await window.navigator.clipboard.writeText(shareLink);
              toast.success('Copied link!');
            }}
          >
            <CopyIcon stroke="#fff" />
            <MenuOptionText>Copy link</MenuOptionText>
          </MenuOption>
          {offialUrl && (
            <MenuOption
              onClick={() => {
                window.open(offialUrl);
              }}
            >
              <CopyIcon stroke="#fff" />
              <MenuOptionText>
                Open in{' '}
                {offialUrl.indexOf(WARPCAST_HOST) === 0
                  ? 'Warpcast'
                  : offialUrl.indexOf(HEY_HOST) === 0
                  ? 'Hey.xyz'
                  : 'New Tab'}
              </MenuOptionText>
            </MenuOption>
          )}
        </MenuWrapper>
      </PopoverBase>
    </>
  );
}

const MenuBtn = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const MenuWrapper = styled.div`
  min-width: 160px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #14171a;

  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  box-sizing: border-box;
`;
const MenuOption = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  img,
  svg {
    width: 12px;
    height: 12px;
  }
`;
const MenuOptionText = styled.span`
  color: #fff;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
