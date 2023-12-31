import styled from 'styled-components';
import ModalContainer from '../common/modal/ModalContainer';
import PostCard, { PostCardData } from './PostCard';
import ReplyForm, { ReplyFormProps } from './ReplyForm';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';

export default function ReplyModal({
  open,
  closeModal,
  postData,
  avatar,
  content,
  setContent,
  disabled,
  submitting,
  onSubmit,
}: {
  postData: PostCardData;
  open: boolean;
  closeModal: () => void;
} & ReplyFormProps) {
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setContent('')}
      className="w-full md:w-[600px]"
    >
      <ModalBody>
        <CloseBtn onClick={closeModal} />
        <PostCard data={postData} showActions={false} />
        <ReplyFormStyled
          disabled={disabled}
          avatar={avatar}
          content={content}
          setContent={setContent}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </ModalBody>
    </ModalContainer>
  );
}
const ModalBody = styled.div`
  max-width: 600px;
  flex-shrink: 0;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
`;
const CloseBtn = styled(ModalCloseBtn)`
  position: absolute;
  top: 20px;
  right: 20px;
`;
const ReplyFormStyled = styled(ReplyForm)`
  background: #14171a;
`;
