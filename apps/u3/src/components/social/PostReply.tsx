import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import MessageIcon from '../icons/MessageIcon';

interface PostReplyProps {
  totalReplies: number;
  replied?: boolean;
  replying?: boolean;
  replyAction?: () => void;
}
export default function PostReply({
  totalReplies,
  replied,
  replying,
  replyAction,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReplyProps) {
  const [hover, setHover] = useState(false);
  return (
    <PostReplyWrapper
      onClick={(e) => {
        if (replyAction) e.stopPropagation();
        if (!replying && replyAction) replyAction();
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      hover={hover}
      {...wrapperProps}
    >
      <span>
        <MessageIcon stroke={replied ? '#9C9C9C' : 'white'} />
      </span>
      {totalReplies} {replying ? 'Replying' : 'Replies'}
    </PostReplyWrapper>
  );
}

const PostReplyWrapper = styled.div<{ hover?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  color: #718096;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */
  > span {
    height: 24px;
    width: 24px;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${(props) =>
      props.hover
        ? 'linear-gradient(78deg, #cd62ff 0%, #62aaff 100%)'
        : 'transparent'};
  }
  &:hover {
    background: linear-gradient(78deg, #cd62ff 0%, #62aaff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
