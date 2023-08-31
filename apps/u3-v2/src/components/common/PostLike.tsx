import styled, { StyledComponentPropsWithRef } from 'styled-components'
import HeartIcon from './icons/HeartIcon'

interface PostLikeProps {
  totalLikes: number
  likeAvatars?: string[]
  liked?: boolean
  liking?: boolean
  likeAction?: () => void
}
export default function PostLike({
  totalLikes,
  likeAvatars,
  liked,
  liking,
  likeAction,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostLikeProps) {
  return (
    <PostLikeWrapper
      onClick={(e) => {
        if (likeAction) e.stopPropagation()
        if (!liking && likeAction) likeAction()
      }}
      {...wrapperProps}
    >
      {likeAvatars && likeAvatars.length > 0 && (
        <PostLikeAvatars likeAvatars={likeAvatars} />
      )}
      <HeartIcon
        fill={liked ? '#E63734' : 'none'}
        stroke={liked ? '#E63734' : 'white'}
      />
      {totalLikes} {liking ? 'Liking' : 'Likes'}
    </PostLikeWrapper>
  )
}

export const PostLikeWrapper = styled.div`
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

export function PostLikeAvatars({
  likeAvatars,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { likeAvatars: string[] }) {
  return (
    <PostLikeAvatarsWrapper {...wrapperProps}>
      {likeAvatars.slice(0, 3).map((avatar, index) => (
        <PostLikeAvatarWrapper key={index}>
          <PostLikeAvatar src={avatar} />
        </PostLikeAvatarWrapper>
      ))}
      {likeAvatars.length > 3 && (
        <PostLikeAvatarWrapper>+{likeAvatars.length - 3}</PostLikeAvatarWrapper>
      )}
    </PostLikeAvatarsWrapper>
  )
}
export const PostLikeAvatarsWrapper = styled.div`
  display: flex;
  align-items: center;
  & > * {
    margin-left: -5px;
  }
`
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
`
export const PostLikeAvatar = styled.img`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  border-radius: 50%;
`
