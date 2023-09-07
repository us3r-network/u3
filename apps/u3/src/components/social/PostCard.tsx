import dayjs from 'dayjs';
import { useMemo } from 'react';

import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { SocailPlatform } from '../../api';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import PostLike from './PostLike';
import PostReply from './PostReply';
import PostReport from './PostReport';

export type PostCardData = {
  platform: SocailPlatform;
  avatar: string;
  name: string;
  handle: string;
  createdAt: string | number;
  content?: string;
  totalLikes?: number;
  totalReplies?: number;
  totalReposts?: number;
  likeAvatars?: string[];
};
interface PostCardProps {
  data: PostCardData;
  contentRender?: () => JSX.Element;
  liked?: boolean;
  replied?: boolean;
  reposted?: boolean;
  liking?: boolean;
  replying?: boolean;
  reposting?: boolean;
  likeAction?: () => void;
  replyAction?: () => void;
  repostAction?: () => void;
  showActions?: boolean;
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
  showActions = true,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostCardProps) {
  return (
    <PostCardWrapper {...wrapperProps}>
      <PostCardUserInfo data={data} />
      <PostCardContentWrapper>
        {contentRender ? contentRender() : data?.content}
      </PostCardContentWrapper>
      {showActions && (
        <PostCardActionsWrapper>
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
        </PostCardActionsWrapper>
      )}
    </PostCardWrapper>
  );
}

export const PostCardWrapper = styled.div`
  background: #212228;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export type PostCardUserInfoData = {
  platform: SocailPlatform;
  avatar: string;
  name: string;
  handle: string;
  createdAt: string | number;
};
export function PostCardUserInfo({
  data,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { data: PostCardUserInfoData }) {
  const PlatFormIcon = useMemo(() => {
    switch (data.platform) {
      case SocailPlatform.Lens:
        return <LensIcon />;
      case SocailPlatform.Farcaster:
        return <FarcasterIcon />;
      default:
        return null;
    }
  }, [data.platform]);
  return (
    <PostCardUserInfoWrapper {...wrapperProps}>
      <Avatar src={data.avatar} />
      <PostCardUserInfoCenter>
        <Name>
          {data.name} {PlatFormIcon}
        </Name>
        <Handle>
          @{data.handle} . {dayjs(data.createdAt).fromNow()}
        </Handle>
      </PostCardUserInfoCenter>
    </PostCardUserInfoWrapper>
  );
}

const PostCardUserInfoWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;
const PostCardUserInfoCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`;
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
`;
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
`;

export const PostCardContentWrapper = styled.div`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px; /* 156.25% */
  word-break: break-all;
  white-space: pre-line;
`;
export const PostCardActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const PostCardImgWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin: 10px;
  flex-direction: column;
  > img {
    max-width: 60%;
  }
`;

export const PostCardCastWrapper = styled.div`
  border-radius: 10px;
  border: 1px solid #9c9c9c;
  color: #fff;
  padding: 10px;
  cursor: pointer;
  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    > img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
  > p {
    color: #c8c4c4;
    margin-bottom: 0;
    margin-top: 10px;
    padding: 0;
  }
`;

export const PostCardNftWrapper = styled.div`
  color: #fff;
  width: 300px;
  border: 1px solid #9c9c9c;
  border-radius: 10px;
  > img {
    width: 100%;
  }
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    > h4 {
      margin: 10px 0;
    }
    > button {
      background: inherit;
      border: 1px solid #9c9c9c;
      padding: 5px 10px;
      border-radius: 10px;
      outline: none;
      color: inherit;
    }
  }
`;

export const PostCardEmbedWrapper = styled.a`
  color: #fff;
  border: 1px solid #9c9c9c;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 10px;
  text-decoration: none;
  > .img {
    flex-shrink: 0;
    width: 110px;
    height: 110px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    > img {
      width: 100%;
    }
  }

  p {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 这里是超出几行省略 */
    overflow: hidden;
  }
`;
