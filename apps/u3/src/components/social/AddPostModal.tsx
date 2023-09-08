import { useCallback, useState } from 'react';
import { makeCastAdd } from '@farcaster/hub-web';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import ModalContainer from '../common/modal/ModalContainer';
import { useFarcasterCtx } from '../../contexts/FarcasterCtx';

import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../../constants/farcaster';
import { getCurrFid } from '../../utils/farsign-utils';

import { SocailPlatform } from '../../api';
import { useLensCtx } from '../../contexts/AppLensCtx';
import { useCreateLensPost } from '../../hooks/lens/useCreateLensPost';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import TextareaBase from '../common/input/TextareaBase';
import { SocialButtonPrimary } from './button/SocialButton';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import usePostAdd from '../../hooks/usePostAdd';

export default function AddPostModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const {
    setText,
    text,
    platforms,
    onSelectPlatform,
    isPending,
    handleSubmit,
  } = usePostAdd({
    closeModal,
  });
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setText('')}
      zIndex={100}
    >
      <ModalBody>
        <ModalHeader>
          <PlatformOptions>
            <PlatformOption
              selected={platforms.has(SocailPlatform.Lens)}
              onClick={() => onSelectPlatform(SocailPlatform.Lens)}
            >
              <LensIcon />
              Lens
            </PlatformOption>
            <PlatformOption
              selected={platforms.has(SocailPlatform.Farcaster)}
              onClick={() => onSelectPlatform(SocailPlatform.Farcaster)}
            >
              <FarcasterIcon />
              Farcaster
            </PlatformOption>
          </PlatformOptions>
          <ModalDescription>
            Post to more than one protocol cannot mention other users
          </ModalDescription>
          <ModalCloseBtn onClick={closeModal} />
        </ModalHeader>
        <PostBox>
          <ContentInput
            placeholder="Create a post..."
            disabled={isPending}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <SubmitBtn
            onClick={() => {
              handleSubmit();
            }}
          >
            {isPending ? 'Posting...' : 'Post'}
          </SubmitBtn>
        </PostBox>
      </ModalBody>
    </ModalContainer>
  );
}

export function AddPostCard() {
  const {
    setText,
    text,
    platforms,
    onSelectPlatform,
    isPending,
    handleSubmit,
  } = usePostAdd({});

  return (
    <PostCardWrapper>
      <div className="top">
        <PlatformOptions>
          <PlatformOption
            selected={platforms.has(SocailPlatform.Lens)}
            onClick={() => onSelectPlatform(SocailPlatform.Lens)}
          >
            <LensIcon />
            Lens
          </PlatformOption>
          <PlatformOption
            selected={platforms.has(SocailPlatform.Farcaster)}
            onClick={() => onSelectPlatform(SocailPlatform.Farcaster)}
          >
            <FarcasterIcon />
            Farcaster
          </PlatformOption>
        </PlatformOptions>
        <ModalDescription>
          Post to more than one protocol cannot mention other users
        </ModalDescription>
      </div>
      <div>
        <ContentInput
          placeholder="Create a post..."
          disabled={isPending}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="tools">
        <span />
        <SubmitBtn
          onClick={() => {
            handleSubmit();
          }}
        >
          {isPending ? 'Posting...' : 'Post'}
        </SubmitBtn>
      </div>
    </PostCardWrapper>
  );
}

const PostCardWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  display: flex;
  gap: 20px;
  flex-direction: column;
  /* border-bottom: 1px solid #718096; */
  > .top {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  > .tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const ModalBody = styled.div`
  width: 600px;
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const ModalDescription = styled.div`
  color: #718096;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const PostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
`;
const PlatformOptions = styled.div`
  display: flex;
  gap: 10px;
`;
const PlatformOption = styled(ButtonPrimaryLine)<{ selected?: boolean }>`
  height: 24px;
  padding: 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  ${({ selected }) =>
    selected ? 'border: 1px solid #fff; ' : 'border: 1px dashed #9C9C9C;'}
  color: ${({ selected }) => (selected ? '#fff' : '#9C9C9C')};
`;
const ContentInput = styled(TextareaBase)`
  resize: vertical;
  padding: 10px;
`;

const SubmitBtn = styled(SocialButtonPrimary)``;
