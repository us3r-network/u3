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
  likeDisabled?: boolean;
  replyDisabled?: boolean;
  repostDisabled?: boolean;
  showActions?: boolean;
  isDetail?: boolean;
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
  likeDisabled,
  replyDisabled,
  repostDisabled,
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
            disabled={likeDisabled}
            totalLikes={data?.totalLikes || 0}
            likeAvatars={[]}
            liking={liking}
            liked={liked}
            likeAction={likeAction}
          />
          <PostReply
            disabled={replyDisabled}
            totalReplies={data?.totalReplies || 0}
            replying={replying}
            replied={replied}
            replyAction={replyAction}
          />
          <PostReport
            disabled={repostDisabled}
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

export const PostCardWrapper = styled.div<{ isDetail?: boolean }>`
  background: #212228;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  cursor: ${(props) => (props.isDetail ? 'initial' : 'pointer')};
  &:hover {
    background: ${(props) => (props.isDetail ? '#212228' : '#39424c')};
  }
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

  color: #718096;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const PostCardShowMoreWrapper = styled.div`
  > button {
    border: none;
    background: linear-gradient(87deg, #cd62ff 0%, #62aaff 100%);
    -webkit-background-clip: text;
    color: transparent;
    padding: 0;
    cursor: pointer;
  }
`;

export const PostCardContentWrapper = styled.div<{ showMore?: boolean }>`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 25px; /* 156.25% */
  word-break: break-all;
  white-space: pre-line;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${(props) => (props.showMore ? 5 : 'initial')};
  overflow: hidden;

  a {
    color: #2594ef;
    text-decoration: none;
  }
`;
export const PostCardActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const PostCardImgWrapper = styled.div<{ len: number }>`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  img {
    width: ${(props) =>
      props.len >= 3
        ? 'calc(33% - 12px)'
        : props.len === 2
        ? 'calc(50% - 10px)'
        : '70%'};
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
  }
`;

export const PostCardCastWrapper = styled.div`
  border-radius: 10px;
  color: #fff;
  padding: 20px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  justify-content: space-between;
  background-color: #14171a;
  > div {
    > div {
      display: flex;
      align-items: center;
      gap: 10px;
      > img {
        width: 21px;
        height: 21px;
        border-radius: 50%;
      }
      > div {
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .username {
        color: #fff;
        font-family: Rubik;
        font-size: 12px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
        margin-right: 5px;
      }
      .uname {
        color: #718096;
        font-family: Rubik;
        font-size: 12px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
    > p {
      color: #c8c4c4;
      margin-bottom: 0;
      margin-top: 10px;
      padding: 0;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
  > img {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    border-radius: 10px;
    overflow: hidden;
  }
`;

export const PostCardNftWrapper = styled.div`
  color: #fff;
  width: 70%;
  border-radius: 10px;
  overflow: hidden;
  background-color: #14171a;
  cursor: initial;
  > img {
    width: 100%;
  }
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    > h4 {
      margin: 0;
      color: #fff;
      font-family: Rubik;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 30px; /* 187.5% */
    }
    > button {
      cursor: pointer;
      border-radius: 10px;
      background: linear-gradient(81deg, #cd62ff 0%, #62aaff 100%);
      padding: 10px 20px;
      border: none;
      outline: none;
      color: inherit;
      color: #000;
      font-family: Rubik;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }
`;

export const PostCardEmbedWrapper = styled.a`
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
  background-color: #14171a;
  text-decoration: none;
  width: 70%;
  min-height: 373px;
  display: flex;
  flex-direction: column;

  > .img {
    flex-grow: 1;
    flex-shrink: 0;
    width: 100%;
    /* min-height: 373px; */
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    > img {
      width: 100%;
    }
  }

  > .intro {
    padding: 20px;

    > h4 {
      color: #fff;
      font-family: Rubik;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 30px; /* 214.286% */
      margin: 0;
    }
    > p {
      color: #fff;
      font-family: Rubik;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 30px; /* 250% */
    }

    > span {
      color: #718096;
      font-family: Rubik;
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 30px; /* 250% */
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
