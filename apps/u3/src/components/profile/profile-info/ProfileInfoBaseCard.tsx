import { UserInfo, UserInfoEditForm } from '@us3r-network/profile';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Dialog, Heading, Modal } from 'react-aria-components';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Profile, useActiveProfile, useFollow } from '@lens-protocol/react-web';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { ButtonPrimaryLineCss } from '../../common/button/ButtonBase';
import { InputBaseCss } from '../../common/input/InputBase';
import { TextareaBaseCss } from '../../common/input/TextareaBase';
import { getAvatarUploadOpts } from '../../../utils/uploadAvatar';
import EditSvg from '../../common/icons/svgs/edit.svg';
import PlatformAccounts, { PlatformAccountsData } from './PlatformAccounts';
import { Copy } from '../../icons/copy';
import { shortPubKey } from '../../../utils/shortPubKey';
import { SocialButtonPrimary } from '../../social/button/SocialButton';
import { ReactComponent as MessageChatSquareSvg } from '../../icons/svgs/message-chat-square.svg';
import {
  MessageRoute,
  useXmtpStore,
} from '../../../contexts/xmtp/XmtpStoreCtx';
import useCanMessage from '../../../hooks/xmtp/useCanMessage';
import { useNav } from '../../../contexts/NavCtx';

interface ProfileInfoBaseCardProps extends StyledComponentPropsWithRef<'div'> {
  did: string;
  address: string;
  platformAccounts: PlatformAccountsData;
  followersCount: number;
  followingCount: number;
  lensProfiles: Profile[];
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function ProfileInfoBaseCard({
  did,
  address,
  platformAccounts,
  followersCount,
  followingCount,
  lensProfiles,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: ProfileInfoBaseCardProps) {
  const session = useSession();

  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const canMesssage = useCanMessage(address);

  const lensProfileFirst = lensProfiles?.[0];

  const { data: activeProfile } = useActiveProfile();

  const { execute: lensFollow, isPending: lensFollowIsPending } = useFollow({
    followee: lensProfileFirst || ({ id: '' } as Profile),
    follower: activeProfile,
  });
  const onFollow = useCallback(async () => {
    if (
      !lensFollowIsPending &&
      lensProfileFirst &&
      !lensProfileFirst.isFollowedByMe &&
      lensProfileFirst?.followStatus?.canFollow
    ) {
      try {
        await lensFollow();
        toast.success('Lens follow success!');
      } catch (error) {
        toast.error(error.message);
      }
    }

    // TODO farcaster平台的follow
  }, [lensProfileFirst, lensFollow, lensFollowIsPending]);

  const { setMessageRouteParams } = useXmtpStore();
  const { setOpenMessageModal } = useNav();
  return (
    <ProfileInfoCardWrapper did={did} {...wrapperProps}>
      {({ isLoginUser }) => {
        const showFollowBtn = !isLoginUser;
        const showMessageBtn = !isLoginUser && canMesssage;
        return (
          <>
            <ProfileInfoBasicWrapper>
              <UserAvatar
                did={did}
                isLoginUser={isLoginUser}
                onClick={() => {
                  if (!isLoginUser) return;
                  setIsOpenEdit(true);
                }}
              />
              <BasicCenter>
                <UserInfo.Name did={did} />
                {address && (
                  <AddressWrapper
                    onClick={() => {
                      navigator.clipboard.writeText(address).then(() => {
                        toast.success('Copied!');
                      });
                    }}
                  >
                    <Address>{shortPubKey(address)}</Address>
                    <Copy />
                  </AddressWrapper>
                )}
              </BasicCenter>
            </ProfileInfoBasicWrapper>

            <PlatformAccounts
              data={platformAccounts}
              isLoginUser={isLoginUser}
            />

            <UserInfo.Bio />

            <CountsWrapper>
              <CountItem onClick={clickFollowers}>
                <Count>{followersCount}</Count>
                <CountText>Followers</CountText>
              </CountItem>
              <CountItem onClick={clickFollowing}>
                <Count>{followingCount}</Count>
                <CountText>Following</CountText>
              </CountItem>
            </CountsWrapper>

            {session?.id && (showFollowBtn || showMessageBtn) && (
              <BtnsWrapper>
                {showFollowBtn && (
                  <FollowBtn onClick={onFollow}>Follow</FollowBtn>
                )}

                {showMessageBtn && (
                  <MessageBtn
                    onClick={() => {
                      setOpenMessageModal(true);
                      setMessageRouteParams({
                        route: MessageRoute.DETAIL,
                        peerAddress: address,
                      });
                    }}
                  >
                    <MessageChatSquareSvg />
                  </MessageBtn>
                )}
              </BtnsWrapper>
            )}

            {isLoginUser && (
              <Modal
                isDismissable
                isOpen={isOpenEdit}
                onOpenChange={setIsOpenEdit}
              >
                <Dialog>
                  <Heading>Edit Info</Heading>
                  <UserInfoEditFormWrapper
                    avatarUploadOpts={getAvatarUploadOpts()}
                    onSuccessfullySubmit={() => {
                      setIsOpenEdit(false);
                    }}
                  >
                    <UserInfoEditForm.AvatarField />

                    <UserInfoEditForm.NameInput />

                    <UserInfoEditForm.BioTextArea />

                    <UserInfoEditForm.SubmitButton>
                      save
                    </UserInfoEditForm.SubmitButton>

                    <UserInfoEditForm.ErrorMessage />
                  </UserInfoEditFormWrapper>
                </Dialog>
              </Modal>
            )}
          </>
        );
      }}
    </ProfileInfoCardWrapper>
  );
}
const ProfileInfoCardWrapper = styled(UserInfo)`
  padding: 20px;
  width: 360px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;

  [data-state-element='Name'] {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    color: #fff;
  }

  [data-state-element='Bio'] {
    color: var(--718096, #718096);

    /* Text/Body 16pt · 1rem */
    font-family: Rubik;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    opacity: 0.8;

    display: block;
    margin-top: 20px;
  }
`;
const UserAvatar = styled(UserInfo.Avatar)<{ isLoginUser?: boolean }>`
  display: inline-block;
  position: relative;
  width: 80px !important;
  height: 80px !important;
  overflow: hidden;
  cursor: pointer;
  & > img {
    width: 100%;
    height: 100%;
    border-radius: 10px !important;
  }
  &:hover {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 80px;
      height: 80px;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url(${EditSvg});
      background-repeat: no-repeat;
      background-position: center;
    }
  }
  ${(props) =>
    !props?.isLoginUser &&
    `
    cursor: default;
    &:hover {
      &::after {
        content: none;
      }
    }
  `}
`;
const ProfileInfoBasicWrapper = styled(UserInfo)`
  display: flex;
  gap: 20px;
`;
const BasicCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 15px;
`;
const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: fit-content;
  cursor: pointer;
`;
const Address = styled.span`
  color: var(--718096, #718096);

  /* Regular-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const UserInfoEditFormWrapper = styled(UserInfoEditForm)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 380px;
  [data-state-element='AvatarField'] {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: 50%;
      height: 50%;
      path {
        fill: #ccc;
      }
    }
  }
  [data-state-element='AvatarUploadInput'] {
    display: none;
  }
  [data-state-element='AvatarPreviewImg'] {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  [data-state-element='NameInput'] {
    ${InputBaseCss}
  }
  [data-state-element='BioTextArea'] {
    ${TextareaBaseCss}
    resize: vertical;
  }
  [data-state-element='SubmitButton'] {
    ${ButtonPrimaryLineCss}
  }
  [data-state-element='ErrorMessage'] {
    color: red;
  }
`;

const CountsWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CountItem = styled.div<{ onClick: () => void }>`
  display: flex;
  align-items: center;
  gap: 5px;
  ${(props) => !!props.onClick && `cursor: pointer;`}
`;
const Count = styled.span`
  color: #fff;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const CountText = styled.span`
  color: #718096;

  /* Regular-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const BtnsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
`;

const FollowBtn = styled(SocialButtonPrimary)`
  flex: 1;
  color: #000;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const MessageBtn = styled(SocialButtonPrimary)`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 10px;
  svg {
    path {
      stroke: #14171a;
    }
  }
`;