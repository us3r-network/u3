/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-06 17:17:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 18:55:48
 * @FilePath: /u3/apps/u3/src/components/social/PostCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { getOfficialPublicationUrl } from 'src/utils/social/lens/getLensExternalLink';
import { SocialPlatform } from '../../services/social/types';
import LensIcon from '../common/icons/LensIcon';
import FarcasterIcon from '../common/icons/FarcasterIcon';
import PostLike from './PostLike';
import PostReply from './PostReply';
import PostReport from './PostRepost';
import { PostCardMenuBtn } from './PostCardMenuBtn';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import TooltipProfileNavigateLink from '../profile/profile-info/TooltipProfileNavigateLink';
import { MultiPlatformShareMenuBtn } from '../shared/share/MultiPlatformShareMenuBtn';
import { SOCIAL_SHARE_TITLE } from '../../constants';
import { SaveButton } from '../shared/button/SaveButton';
import { cn } from '@/lib/utils';

export type PostCardData = {
  platform: SocialPlatform;
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
  id?: string;
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
  showMenuBtn?: boolean;
  isFollowed?: boolean;
  followPending?: boolean;
  unfollowPending?: boolean;
  followAction?: () => void;
  shareLink?: string;
  shareLinkEmbedTitle?: string;
}
export default function PostCard({
  id,
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
  showMenuBtn,
  isFollowed,
  followPending,
  unfollowPending,
  followAction,
  shareLink,
  shareLinkEmbedTitle,
  isDetail,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostCardProps) {
  const [linkParam, setLinkParam] = useState(null);
  useEffect(() => {
    if (isDetail)
      setLinkParam({
        url: getOfficialPublicationUrl(id),
        type: 'link',
        title: data?.content.slice(0, 200), // todo: expand this limit at model
      });
  }, [id, isDetail]);
  return (
    <PostCardWrapper {...wrapperProps} id={id}>
      <PostCardHeaderWrapper>
        <PostCardUserInfo data={data} />
        {/* {showMenuBtn && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PostCardMenuBtn
              data={data}
              isFollowed={isFollowed}
              followPending={followPending}
              unfollowPending={unfollowPending}
              followAction={followAction}
            />
          </div>
        )} */}
      </PostCardHeaderWrapper>
      <PostCardContentWrapper>
        {contentRender ? contentRender() : data?.content}
      </PostCardContentWrapper>
      {showActions && (
        <PostCardFooterWrapper>
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
          <PostCardActionsWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {isDetail && <SaveButton linkId={null} link={linkParam} />}
            <PostShareMenuBtn
              offialUrl={getOfficialPublicationUrl(id)}
              shareLink={shareLink}
              shareLinkDefaultText={SOCIAL_SHARE_TITLE}
              shareLinkEmbedTitle={shareLinkEmbedTitle}
              popoverConfig={{ placement: 'top end', offset: 0 }}
            />
          </PostCardActionsWrapper>
        </PostCardFooterWrapper>
      )}
    </PostCardWrapper>
  );
}

export const PostShareMenuBtn = styled(MultiPlatformShareMenuBtn)`
  border: none;
  padding: 0px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: none;
  &:not(:disabled):hover {
    border: none;
    background-color: #14171a;
  }
  & > svg {
    width: 12px;
    height: 12px;
    cursor: pointer;
    path {
      stroke: #718096;
    }
  }
`;

export const PostCardWrapper = styled.div<{ isDetail?: boolean }>`
  background: #212228;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: ${(props) => (props.isDetail ? 'initial' : 'pointer')};
  &:hover {
    background: ${(props) => (props.isDetail ? '#212228' : '#000000')};
  }
`;
export const PostCardHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
export const PostCardFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export type PostCardUserInfoData = {
  platform: SocialPlatform;
  avatar: string;
  name: string;
  handle: string;
  createdAt: string | number;
};
export type PostCardUserInfoProps = StyledComponentPropsWithRef<'div'> & {
  data: PostCardUserInfoData;
};
export function PostCardUserInfo({
  data,
  ...wrapperProps
}: PostCardUserInfoProps) {
  const PlatFormIcon = useMemo(() => {
    switch (data.platform) {
      case SocialPlatform.Lens:
        return <LensIcon />;
      case SocialPlatform.Farcaster:
        return <FarcasterIcon />;
      default:
        return null;
    }
  }, [data.platform]);
  const profileIdentity = useMemo(() => {
    if (data.handle.endsWith('.eth')) return data.handle;
    switch (data.platform) {
      case SocialPlatform.Lens:
        return lensHandleToBioLinkHandle(data.handle);
      case SocialPlatform.Farcaster:
        return farcasterHandleToBioLinkHandle(data.handle);
      default:
        return '';
    }
  }, [data]);

  return (
    <PostCardUserInfoWrapper {...wrapperProps}>
      <TooltipProfileNavigateLinkWrapper identity={profileIdentity}>
        <Avatar src={data.avatar} />
        <PostCardUserInfoCenter>
          <Name>
            <div className={cn('line-clamp-1', 'max-sm:max-w-[200px]')}>
              {data.name}
            </div>
            {PlatFormIcon}
          </Name>
          <Handle>
            <div className="line-clamp-1">
              @{data.handle} · {dayjs(data.createdAt).fromNow()}
            </div>
          </Handle>
        </PostCardUserInfoCenter>
      </TooltipProfileNavigateLinkWrapper>
    </PostCardUserInfoWrapper>
  );
}

const PostCardUserInfoWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;
const TooltipProfileNavigateLinkWrapper = styled(TooltipProfileNavigateLink)`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  &:hover {
    text-decoration: none;
  }
`;
const PostCardUserInfoCenter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
`;
const Name = styled.div`
  width: 100%;
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
  width: 100%;
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
    background: #454c99;
    -webkit-background-clip: text;
    color: #5057aa;
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
  line-height: 20px; /* 156.25% */
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
    &:hover {
      text-decoration: underline;
    }
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
        : '100%'};
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
  }
`;
export const PostCardAudioWrapper = styled.div`
  width: 373px;
  max-width: 100%;
`;

export const PostCardVideoWrapper = styled.div`
  width: 373px;
  max-width: 100%;
`;

export const PostCardEmbedWrapper = styled.div`
  color: #fff;
  border-radius: 10px;
  overflow: hidden;
  background-color: #14171a;
  text-decoration: none;
  width: 100%;
  min-height: 349px;
  display: flex;
  flex-direction: column;
  cursor: default;

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
`;
