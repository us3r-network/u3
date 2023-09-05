import styled, { StyledComponentPropsWithRef } from 'styled-components'
import MessageIcon from '../icons/MessageIcon'

interface PostReplyProps {
  totalReplies: number
  replied?: boolean
  replying?: boolean
  replyAction?: () => void
}
export default function PostReply ({
  totalReplies,
  replied,
  replying,
  replyAction,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReplyProps) {
  return (
    <PostReplyWrapper
      onClick={e => {
        if (replyAction) e.stopPropagation()
        if (!replying && replyAction) replyAction()
      }}
      {...wrapperProps}
    >
      <MessageIcon stroke={replied ? '#9C9C9C' : 'white'} />
      {totalReplies} {replying ? 'Replying' : 'Replies'}
    </PostReplyWrapper>
  )
}

const PostReplyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  color: #9c9c9c;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */
`
