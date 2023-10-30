import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { MessageIcon2, MessageIcon2Color } from '../common/icons/MessageIcon';

interface PostReplyProps {
  totalReplies: number;
  replied?: boolean;
  replying?: boolean;
  replyAction?: () => void;
  disabled?: boolean;
}
export default function PostReply({
  totalReplies,
  replied,
  replying,
  replyAction,
  disabled,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReplyProps) {
  const [hover, setHover] = useState(false);
  return (
    <PostReplyWrapper
      disabled={disabled}
      replied={replied}
      onClick={(e) => {
        if (disabled) return;
        if (replyAction) e.stopPropagation();
        if (!replying && replyAction) replyAction();
      }}
      onMouseEnter={() => {
        if (disabled) return;
        setHover(true);
      }}
      onMouseLeave={() => {
        if (disabled) return;
        setHover(false);
      }}
      hover={hover}
      {...wrapperProps}
    >
      <span>{hover || replied ? <MessageIcon2Color /> : <MessageIcon2 />}</span>
      {totalReplies} {replying ? 'Replying' : 'Replies'}
    </PostReplyWrapper>
  );
}

const PostReplyWrapper = styled.div<{
  hover?: boolean;
  replied?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  color: #718096;
  background: ${(props) =>
    props.replied
      ? 'linear-gradient(78deg, #cd62ff 0%, #62aaff 100%)'
      : 'initial'};
  background-clip: ${(props) => (props.replied ? 'text' : 'initial')};
  -webkit-background-clip: ${(props) => (props.replied ? 'text' : 'initial')};
  -webkit-text-fill-color: ${(props) =>
    props.replied ? 'transparent' : 'initial'};

  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */
  > span {
    height: 20px;
    width: 20px;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${(props) =>
      props.hover
        ? 'linear-gradient(45deg, rgba(205, 98, 255, 0.20) 0%, rgba(98, 170, 255, 0.20) 100%);'
        : 'transparent'};
  }
  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      background: linear-gradient(78deg, #cd62ff 0%, #62aaff 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `}
  }
`;
