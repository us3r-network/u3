import styled, { StyledComponentPropsWithRef } from 'styled-components'
import { SocailPlatform } from '../api'
import HeartIcon from './common/icons/HeartIcon'
import MessageIcon from './common/icons/MessageIcon'
import ForwardIcon from './common/icons/ForwardIcon'
import { useMemo } from 'react'
import LensIcon from './common/icons/LensIcon'
import FarcasterIcon from './common/icons/FarcasterIcon'
import dayjs from 'dayjs'

export type PostCardData = {
  platform: SocailPlatform
  avatar: string
  name: string
  handle: string
  timestamp: string | number
  content?: string
  totalLikes: number
  totalReplies: number
  totalReposts: number
  likesAvatar: string[]
}
interface PostCardProps {
  data: PostCardData
  contentRender?: () => JSX.Element
  liked?: boolean
  replied?: boolean
  reposted?: boolean
  liking?: boolean
  replying?: boolean
  reposting?: boolean
  likeAction?: () => void
  replyAction?: () => void
  repostAction?: () => void
}
export default function PostCard({
  data,
  contentRender,
  liked,
  replied,
  reposted,
  liking,
  replying,
  reposting,
  likeAction,
  replyAction,
  repostAction,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostCardProps) {
  const PlatFormIcon = useMemo(() => {
    switch (data.platform) {
      case SocailPlatform.Lens:
        return <LensIcon />
      case SocailPlatform.Farcaster:
        return <FarcasterIcon />
      default:
        return null
    }
  }, [data.platform])
  return (
    <PostCardWrapper {...wrapperProps}>
      <Header>
        <Avatar src={data.avatar} />
        <HeaderCenter>
          <Name>
            {data.name} {PlatFormIcon}
          </Name>
          <Handle>
            {data.handle} . {dayjs(data.timestamp).fromNow()}
          </Handle>
        </HeaderCenter>
      </Header>
      <Content>{contentRender ? contentRender() : data?.content}</Content>
      <Footer>
        <Action
          onClick={() => {
            if (!liking && likeAction) likeAction()
          }}
        >
          <HeartIcon
            fill={liked ? '#E63734' : 'none'}
            stroke={liked ? '#E63734' : 'white'}
          />
          {data.totalLikes} {liking ? 'Liking' : 'Likes'}
        </Action>
        <Action
          onClick={() => {
            if (!replying && replyAction) replyAction()
          }}
        >
          <MessageIcon stroke={replied ? '#9C9C9C' : 'white'} />
          {data.totalReplies} {replying ? 'Replying' : 'Replies'}
        </Action>
        <Action
          onClick={() => {
            if (!reposting && repostAction) repostAction()
          }}
        >
          <ForwardIcon stroke={reposted ? '#9C9C9C' : 'white'} />
          {data.totalReposts} {reposting ? 'Reposting' : 'Reposts'}
        </Action>
      </Footer>
    </PostCardWrapper>
  )
}

const PostCardWrapper = styled.div`
  background: #212228;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`
const HeaderCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`
const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
const Handle = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  color: #9c9c9c;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const Content = styled.div`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px; /* 156.25% */
`
const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`
const Action = styled.div`
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
