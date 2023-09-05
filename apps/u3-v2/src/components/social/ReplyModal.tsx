import styled from 'styled-components'
import ModalContainer from '../common/modal/ModalContainer'
import PostCard, { PostCardData } from './PostCard'
import ReplyForm, { ReplyFormProps } from './ReplyForm'

export default function ReplyModal ({
  open,
  closeModal,
  postData,
  avatar,
  content,
  setContent,
  disabled,
  submitting,
  onSubmit
}: {
  postData: PostCardData
  open: boolean
  closeModal: () => void
} & ReplyFormProps) {
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={() => setContent('')}
    >
      <ModalBody>
        <PostCard data={postData} showActions={false} />
        <ReplyForm
          disabled={disabled}
          avatar={avatar}
          content={content}
          setContent={setContent}
          submitting={submitting}
          onSubmit={onSubmit}
        />
      </ModalBody>
    </ModalContainer>
  )
}
const ModalBody = styled.div`
  width: 730px;
  flex-shrink: 0;
`
