import { UserInfo, UserInfoEditForm } from '@us3r-network/profile';
import styled from 'styled-components';
import { useState } from 'react';
import {
  Dialog,
  Heading,
  Label,
  Modal,
  TextField,
} from 'react-aria-components';
import EditSvg from '../../common/icons/svgs/edit.svg';
import { getAvatarUploadOpts } from '../../../utils/uploadAvatar';
import { InputBaseCss } from '../../common/input/InputBase';
import { TextareaBaseCss } from '../../common/input/TextareaBase';
import { ButtonPrimaryLineCss } from '../../common/button/ButtonBase';

export default function UserInfoStyled() {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <UserInfoWrapper>
      <UserInfo.Avatar
        onClick={() => {
          setIsOpenEdit(true);
        }}
      />
      <UserInfo.Name />
      <UserInfo.Bio data-state-element="Bio" />
      <Modal isDismissable isOpen={isOpenEdit} onOpenChange={setIsOpenEdit}>
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

            <UserInfoEditForm.SubmitButton>save</UserInfoEditForm.SubmitButton>

            <UserInfoEditForm.ErrorMessage />
          </UserInfoEditFormWrapper>
        </Dialog>
      </Modal>
    </UserInfoWrapper>
  );
}
const UserInfoWrapper = styled(UserInfo)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 20px;
  width: 360px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;

  [data-us3r-component='UserAvatar'] {
    display: inline-block;
    margin: 0 auto;
    position: relative;
    width: 120px !important;
    height: 120px !important;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 120px;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url(${EditSvg});
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }

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
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #718096;
  }
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
