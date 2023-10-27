import {
  UserAvatar,
  UserInfo,
  UserInfoEditForm,
  UserName,
} from '@us3r-network/profile';
import styled, { css } from 'styled-components';
import { Dialog, Heading, Modal } from 'react-aria-components';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { InputBaseCss } from '../../common/input/InputBase';
import { TextareaBaseCss } from '../../common/input/TextareaBase';
import { ButtonPrimaryLineCss } from '../../common/button/ButtonBase';
import { getAddressWithDidPkh } from '../../../utils/shared/did';
import { getAvatarUploadOpts } from '../../../utils/profile/uploadAvatar';
import { shortPubKey } from '../../../utils/shared/shortPubKey';
import { Copy } from '../../common/icons/copy';
import ProfileAvatar from './ProfileAvatar';

export function U3ProfileBasicInfo({ did }: { did: string }) {
  const address = getAddressWithDidPkh(did);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <U3ProfileBasicInfoWrapper did={did}>
      {({ isLoginUser }) => {
        return (
          <>
            <UserAvatar
              did={did}
              style={{ width: 'fit-content', height: 'fit-content' }}
            >
              {({ avatarSrc }) => {
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
            <BasicCenter>
              <U3ProfileName did={did} />
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
    </U3ProfileBasicInfoWrapper>
  );
}

export function PlatformProfileBasicInfo({
  data,
}: {
  data: {
    avatar: string;
    name: string;
    address?: string;
    identity?: string | number;
  };
}) {
  const { avatar, name, address, identity = '' } = data;
  return (
    <PlatformProfileBasicInfoWrapper>
      <ProfileAvatar src={avatar} />
      <BasicCenter>
        <PlatformProfileName>{name}</PlatformProfileName>
        <AddressWrapper
          onClick={() => {
            if (!address) return;
            navigator.clipboard.writeText(address).then(() => {
              toast.success('Copied!');
            });
          }}
        >
          <Address>{address ? shortPubKey(address) : identity}</Address>
          {address && <Copy />}
        </AddressWrapper>
      </BasicCenter>
    </PlatformProfileBasicInfoWrapper>
  );
}
const BaseWrapperCss = css`
  display: flex;
  gap: 20px;
`;

const U3ProfileBasicInfoWrapper = styled(UserInfo)`
  ${BaseWrapperCss}
`;

const PlatformProfileBasicInfoWrapper = styled.div`
  ${BaseWrapperCss}
`;
const BasicCenter = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 15px;
`;

const NameCss = css`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #fff;
`;
const U3ProfileName = styled(UserName)`
  ${NameCss}
`;
const PlatformProfileName = styled.span`
  ${NameCss}
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
