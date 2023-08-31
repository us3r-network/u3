import styled, { StyledComponentPropsWithRef } from 'styled-components'
import dayjs from 'dayjs'
import PostLike from './PostLike'
import PostReply from './PostReply'
import PostReport from './PostReport'

export type ReplyCardData = {
  avatar: string
  name: string
  handle: string
  createdAt: string | number
  content?: string
  totalLikes?: number
  totalReplies?: number
  totalReposts?: number
  likesAvatar?: string[]
}
interface ReplyCardProps {
  data: ReplyCardData
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
  showActions?: boolean
}
export default function ReplyCard({
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
  showActions = true,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & ReplyCardProps) {
  return (
    <ReplyCardWrapper {...wrapperProps}>
      <Header>
        <Avatar src={data.avatar} />
        <HeaderCenter>
          <Name>
            {data.name}{' '}
            <Handle>
              {data.handle} . {dayjs(data.createdAt).fromNow()}
            </Handle>
          </Name>
        </HeaderCenter>
        {showActions && (
          <Actions>
            <PostLike
              totalLikes={data?.totalLikes || 0}
              likesAvatar={[]}
              liking={liking}
              liked={liked}
              likeAction={likeAction}
            />
            <PostReply
              totalReplies={data?.totalReplies || 0}
              replying={replying}
              replied={replied}
              replyAction={replyAction}
            />
            <PostReport
              totalReposts={data?.totalReposts || 0}
              reposting={reposting}
              reposted={reposted}
              repostAction={repostAction}
            />
          </Actions>
        )}
      </Header>
      <Content>{contentRender ? contentRender() : data?.content}</Content>
    </ReplyCardWrapper>
  )
}

const ReplyCardWrapper = styled.div`
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
const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
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
