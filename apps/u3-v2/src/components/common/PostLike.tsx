import styled, { StyledComponentPropsWithRef } from 'styled-components'
import HeartIcon from './icons/HeartIcon'

interface PostLikeProps {
  totalLikes: number
  likesAvatar: string[]
  liked?: boolean
  liking?: boolean
  likeAction?: () => void
}
export default function PostLike({
  totalLikes,
  likesAvatar,
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
      {likesAvatar.length > 0 && (
        <AvatarList onClick={(e) => e.stopPropagation()}>
          {likesAvatar.slice(0, 3).map((avatar, i) => (
            <Avatar key={i} src={avatar} />
          ))}
        </AvatarList>
      )}
      <HeartIcon
        fill={liked ? '#E63734' : 'none'}
        stroke={liked ? '#E63734' : 'white'}
      />
      {totalLikes} {liking ? 'Liking' : 'Likes'}
    </PostLikeWrapper>
  )
}

const PostLikeWrapper = styled.div`
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
const AvatarList = styled.div`
  margin-left: -10px;
  & > * {
    margin-left: 10px;
  }
`
const Avatar = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
`
