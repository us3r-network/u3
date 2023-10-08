import { useRef, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import PopoverBase from '../common/popover/PopoverBase';
import CopyIcon from '../icons/CopyIcon';
import { TwitterLine } from '../icons/twitter';
import AddUserIcon from '../icons/AddUserIcon';
import MoreIcon from '../icons/MoreIcon';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';

export type PostCardMenuData = {
  name: string;
  handle: string;
};
interface PostCardMenuBtnProps extends StyledComponentPropsWithRef<'button'> {
  data: PostCardMenuData;
  isFollowed?: boolean;
  followPending?: boolean;
  unfollowPending?: boolean;
  followAction?: () => void;
  shareAction?: () => void;
  copyAction?: () => void;
}
export function PostCardMenuBtn({
  data,
  isFollowed,
  followPending,
  unfollowPending,
  followAction,
  shareAction,
  copyAction,
  ...btnProps
}: PostCardMenuBtnProps) {
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
        <MenuIcon />
      </MenuBtn>
      <PopoverBase
        placement="bottom end"
        offset={-5}
        triggerRef={menuTriggerRef}
        isOpen={isOpenMenu}
        onOpenChange={setIsOpenMenu}
      >
        <MenuWrapper>
          <MenuOption onClick={followAction}>
            <AddUserIcon />
            <MenuOptionText>
              {(() => {
                if (followPending) {
                  return 'Following...';
                }
                if (unfollowPending) {
                  return 'Unfollowing...';
                }
                if (isFollowed) {
                  return 'Unfollow';
                }
                return 'Follow';
              })()}{' '}
              @{data?.handle || data?.name}
            </MenuOptionText>
          </MenuOption>
          <MenuOption onClick={shareAction}>
            <TwitterLine />
            <MenuOptionText>Share to Twitter</MenuOptionText>
          </MenuOption>
          <MenuOption onClick={copyAction}>
            <CopyIcon stroke="#fff" />
            <MenuOptionText>Copy link</MenuOptionText>
          </MenuOption>
        </MenuWrapper>
      </PopoverBase>
    </>
  );
}

const MenuBtn = styled(ButtonPrimaryLine)`
  border: none;
  padding: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const MenuIcon = styled(MoreIcon)`
  width: 12px;
  height: 12px;
  cursor: pointer;
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
