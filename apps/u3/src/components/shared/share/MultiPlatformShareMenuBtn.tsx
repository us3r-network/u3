import { useRef, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { toast } from 'react-toastify';
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
import { SOCIAL_SHARE_TITLE } from '../../../constants';

interface MultiPlatformShareMenuBtnProps
  extends StyledComponentPropsWithRef<'button'> {
  link: string;
  popoverConfig?: Omit<PopoverBaseProps, 'children'>;
}
export function MultiPlatformShareMenuBtn({
  link,
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
              alert('TODO');
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
              alert('TODO');
            }}
          >
            <LensIcon />
            <MenuOptionText>Share to Lens</MenuOptionText>
          </MenuOption>
          <MenuOption
            onClick={() => {
              tweetShare(SOCIAL_SHARE_TITLE, link);
            }}
          >
            <TwitterLine />
            <MenuOptionText>Share to Twitter</MenuOptionText>
          </MenuOption>
          <MenuOption
            onClick={async () => {
              await window.navigator.clipboard.writeText(link);
              toast.success('Copied link!');
            }}
          >
            <CopyIcon stroke="#fff" />
            <MenuOptionText>Copy link</MenuOptionText>
          </MenuOption>
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
