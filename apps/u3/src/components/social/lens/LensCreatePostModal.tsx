import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import ModalContainer from '../../common/modal/ModalContainer';
import InputBase from '../../common/input/InputBase';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import { useCreateLensPost } from '../../../hooks/social/lens/useCreateLensPost';

export default function LensCommentPostModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { createText, isPending } = useCreateLensPost();
  const [content, setContent] = useState('');

  const onSubmit = useCallback(async () => {
    try {
      await createText(content);
      closeModal();
      setContent('');
      toast.success('Post created successfully.');
    } catch (error) {
      toast.error('Failed to create post.');
    }
  }, [content, createText, closeModal]);

  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setContent('')}
    >
      <ModalBody>
        <ContentInput
          disabled={isPending}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <SubmitButton disabled={isPending} onClick={onSubmit}>
          {isPending ? 'Loading...' : '+ Create Post'}
        </SubmitButton>
      </ModalBody>
    </ModalContainer>
  );
}
const ModalBody = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ContentInput = styled(InputBase)``;
const SubmitButton = styled(ButtonPrimaryLine)`
  width: 100%;
`;
