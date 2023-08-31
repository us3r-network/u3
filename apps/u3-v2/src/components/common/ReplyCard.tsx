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
  likeAvatars?: string[]
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
      <ReplyCardHeader>
        <ReplyCardUserInfo data={data} />
        {showActions && (
          <ReplyCardActionsWrapper>
            <PostLike
              totalLikes={data?.totalLikes || 0}
              likeAvatars={[]}
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
          </ReplyCardActionsWrapper>
        )}
      </ReplyCardHeader>
      <ReplyCardContentWrapper>
        {contentRender ? contentRender() : data?.content}
      </ReplyCardContentWrapper>
    </ReplyCardWrapper>
  )
}

export const ReplyCardWrapper = styled.div`
  background: #212228;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
export const ReplyCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

export type ReplyCardUserInfoData = {
  avatar: string
  name: string
  handle: string
  createdAt: string | number
}
export function ReplyCardUserInfo({
  data,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { data: ReplyCardUserInfoData }) {
  return (
    <ReplyCardUserInfoWrapper {...wrapperProps}>
      <Avatar src={data.avatar} />
      <ReplyCardUserInfoCenter>
        <Name>{data.name}</Name>
        <Handle>
          @{data.handle} . {dayjs(data.createdAt).fromNow()}
        </Handle>
      </ReplyCardUserInfoCenter>
    </ReplyCardUserInfoWrapper>
  )
}

const ReplyCardUserInfoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`
const ReplyCardUserInfoCenter = styled.div`
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
export const ReplyCardActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`
export const ReplyCardContentWrapper = styled.div`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px; /* 156.25% */
`
