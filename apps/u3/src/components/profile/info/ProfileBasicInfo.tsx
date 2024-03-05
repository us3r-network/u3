import {
  UserAvatar,
  UserInfo,
  UserInfoEditForm,
  UserName,
} from '@us3r-network/profile';
import { useState } from 'react';
import { Dialog, Heading, Modal } from 'react-aria-components';
import styled from 'styled-components';
import { getAvatarUploadOpts } from '../../../utils/profile/uploadAvatar';
import { ButtonPrimaryLineCss } from '../../common/button/ButtonBase';
import { InputBaseCss } from '../../common/input/InputBase';
import { TextareaBaseCss } from '../../common/input/TextareaBase';
import NavigateToProfileLink from './NavigateToProfileLink';
import ProfileAvatar from './ProfileAvatar';

const extractErrorMessage = (message) => {
  try {
    const match = message.match(/{.*}/);
    if (!match) return message;
    const jsonStr = match[0];

    const obj = JSON.parse(jsonStr);
    return (obj.error as string)
      .replace('Validation Error: ', '')
      .replaceAll('data/', '');
  } catch (e) {
    // 如果转换失败，返回原始消息
    return message;
  }
};

export function U3ProfileBasicInfo({
  did,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
}: {
  did: string;
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
}) {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <UserInfo className="flex flex-col gap-4" did={did}>
      {({ isLoginUser }) => {
        return (
          <>
            <UserAvatar
              did={did}
              style={{ width: 'fit-content', height: 'fit-content' }}
            >
              {({ avatarSrc }) => {
                if (navigateToProfileUrl) {
                  return (
                    <NavigateToProfileLink
                      href={navigateToProfileUrl}
                      onNavigateToProfileAfter={onNavigateToProfileAfter}
                    >
                      <ProfileAvatar src={avatarSrc} />
                    </NavigateToProfileLink>
                  );
                }
                return (
                  <ProfileAvatar
                    src={avatarSrc}
                    isLoginUser={isLoginUser}
                    onClick={() => {
                      if (!isLoginUser) return;
                      setIsOpenEdit(true);
                    }}
                  />
                );
              }}
            </UserAvatar>
            {navigateToProfileUrl ? (
              <NavigateToProfileLink
                href={navigateToProfileUrl}
                onNavigateToProfileAfter={onNavigateToProfileAfter}
              >
                <UserName className="text-xl text-white" did={did} />
              </NavigateToProfileLink>
            ) : (
              <UserName className="text-xl text-white" did={did} />
            )}
            <UserInfo.Bio className="text-md text-white" />
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
                    {({ errMsg }) => {
                      return (
                        <>
                          <UserInfoEditForm.AvatarField />

                          <UserInfoEditForm.NameInput />

                          <UserInfoEditForm.BioTextArea />

                          <UserInfoEditForm.SubmitButton>
                            save
                          </UserInfoEditForm.SubmitButton>
                          <span className="errorMessage">
                            {extractErrorMessage(errMsg)}
                          </span>
                        </>
                      );
                    }}
                  </UserInfoEditFormWrapper>
                </Dialog>
              </Modal>
            )}
          </>
        );
      }}
    </UserInfo>
  );
}

export function PlatformProfileBasicInfo({
  data,
  navigateToProfileUrl,
  onNavigateToProfileAfter,
}: {
  data: {
    avatar: string;
    name: string;
    bio?: string;
    identity?: string | number;
  };
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
}) {
  const { avatar, name, bio } = data;
  return (
    <div className="flex flex-col gap-4">
      {navigateToProfileUrl ? (
        <NavigateToProfileLink
          href={navigateToProfileUrl}
          onNavigateToProfileAfter={onNavigateToProfileAfter}
        >
          <ProfileAvatar src={avatar} />
        </NavigateToProfileLink>
      ) : (
        <ProfileAvatar src={avatar} />
      )}
      {navigateToProfileUrl ? (
        <NavigateToProfileLink
          href={navigateToProfileUrl}
          onNavigateToProfileAfter={onNavigateToProfileAfter}
        >
          <h3 className="text-white">{name}</h3>
        </NavigateToProfileLink>
      ) : (
        <h3 className="text-xl text-white">{name}</h3>
      )}
      <p className="text-white line-clamp-3">{bio}</p>
    </div>
  );
}

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
  .errorMessage {
    color: #e63734;
  }
`;
