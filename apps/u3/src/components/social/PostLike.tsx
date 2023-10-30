import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useState } from 'react';

import HeartIcon, { HeartIcon2 } from '../common/icons/HeartIcon';

interface PostLikeProps {
  totalLikes: number;
  likeAvatars?: string[];
  liked?: boolean;
  liking?: boolean;
  likeAction?: () => void;
  disabled?: boolean;
}
export default function PostLike({
  totalLikes,
  likeAvatars,
  liked,
  liking,
  likeAction,
  disabled,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostLikeProps) {
  const [hover, setHover] = useState(false);
  return (
    <PostLikeWrapper
      disabled={disabled}
      liked={liked}
      onMouseEnter={() => {
        if (disabled) return;
        setHover(true);
      }}
      onMouseLeave={() => {
        if (disabled) return;
        setHover(false);
      }}
      onClick={(e) => {
        if (disabled) return;
        if (likeAction) e.stopPropagation();
        if (!liking && likeAction) likeAction();
      }}
      hover={hover}
      {...wrapperProps}
    >
      {likeAvatars && likeAvatars.length > 0 && (
        <PostLikeAvatars likeAvatars={likeAvatars} />
      )}
      <span>
        <HeartIcon2 fill={hover ? '#F81775' : liked ? '#F81775' : ''} />
      </span>
      {totalLikes} {liking ? 'Liking' : 'Likes'}
    </PostLikeWrapper>
  );
}

export const PostLikeWrapper = styled.div<{
  hover?: boolean;
  liked?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  color: ${(props) => (props.liked ? '#F81775' : '#718096')};
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
      props.hover ? 'rgba(248, 23, 117, 0.20)' : 'transparent'};
  }
  &:hover {
    ${(props) => !props.disabled && `color: #e63734;`}
  }
`;

export function PostLikeAvatars({
  likeAvatars,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { likeAvatars: string[] }) {
  return (
    <PostLikeAvatarsWrapper {...wrapperProps}>
      {likeAvatars.slice(0, 3).map((avatar, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <PostLikeAvatarWrapper key={index}>
          <PostLikeAvatar src={avatar} />
        </PostLikeAvatarWrapper>
      ))}
      {likeAvatars.length > 3 && (
        <PostLikeAvatarWrapper>+{likeAvatars.length - 3}</PostLikeAvatarWrapper>
      )}
    </PostLikeAvatarsWrapper>
  );
}
export const PostLikeAvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-left: 0px;
  }
`;
export const PostLikeAvatarWrapper = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;
export const PostLikeAvatar = styled.img`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`;
