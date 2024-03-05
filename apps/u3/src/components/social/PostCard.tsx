/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-06 17:17:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 18:55:48
 * @FilePath: /u3/apps/u3/src/components/social/PostCard.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dayjs from 'dayjs';
import { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';

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
import TooltipProfileNavigateLink from '../profile/info/TooltipProfileNavigateLink';
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

export function PostCardWrapperV2({
  isDetail,
  className,
  ...props
}: ComponentPropsWithRef<'div'> & {
  isDetail?: boolean;
}) {
  return (
    <div
      className={cn(
        'bg-[#20262F] hover:bg-[#000000] px-[20px] box-border flex cursor-pointer border-b border-[#39424c]',
        'max-sm:px-0',
        isDetail && 'hover:bg-[#20262F] cursor-default',
        className
      )}
      {...props}
    />
  );
}
export function PostCardMainWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'> & {
  isDetail?: boolean;
}) {
  return (
    <div
      className={cn(
        'w-full flex-1 p-[10px] box-border flex flex-col gap-[10px] ',
        className
      )}
      {...props}
    />
  );
}
export const PostCardHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
// export const PostCardFooterWrapper = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 10px;
// `;

export function PostCardFooterWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('flex justify-between items-center gap-[10px]', className)}
      {...props}
    />
  );
}

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

export function PostCardUserInfoV2({
  data,
  className,
  ...wrapperProps
}: ComponentPropsWithRef<'div'> & {
  data: PostCardUserInfoData;
}) {
  const { handle, platform } = data;
  const profileIdentity = useMemo(() => {
    if (handle.endsWith('.eth')) return handle;
    switch (platform) {
      case SocialPlatform.Lens:
        return lensHandleToBioLinkHandle(handle);
      case SocialPlatform.Farcaster:
        return farcasterHandleToBioLinkHandle(handle);
      default:
        return '';
    }
  }, [handle, platform]);

  return (
    <div
      className={cn('flex items-center gap-[5px]', className)}
      {...wrapperProps}
    >
      <TooltipProfileNavigateLinkWrapper identity={profileIdentity}>
        <img
          alt=""
          src={data.avatar}
          className="w-[20px] h-[20px] rounded-full object-cover"
        />
        <div className="text-[#FFF] text-[14px] font-medium  line-clamp-1">
          {data.name}
        </div>
      </TooltipProfileNavigateLinkWrapper>
      <div className="text-[#718096] text-[12px] font-normal line-clamp-1">
        @{data.handle} · {dayjs(data.createdAt).fromNow()}
      </div>
    </div>
  );
}

export function PostCardPlatformInfo({
  platform,
  className,
  ...wrapperProps
}: ComponentPropsWithRef<'div'> & {
  platform: SocialPlatform;
}) {
  let icon = null;
  let name = '';
  switch (platform) {
    case SocialPlatform.Lens:
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clipPath="url(#clip0_3863_8438)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.6378 5.36946C11.2116 4.88349 11.8519 4.69859 12.4659 4.74534C13.1208 4.7952 13.7269 5.10682 14.1796 5.55945C14.6322 6.01211 14.9432 6.61758 14.993 7.271C15.0432 7.93039 14.8257 8.621 14.2523 9.22707C14.1998 9.28293 14.1462 9.33799 14.0915 9.39238C11.4904 11.9931 8.03536 12 8.00001 12H7.99984C7.98218 12 4.51615 11.9999 1.90838 9.39212L1.90782 9.39146C1.85398 9.33732 1.80096 9.28279 1.74874 9.228L1.74832 9.22747C1.1746 8.62192 0.956881 7.93147 1.00695 7.27209C1.05657 6.61877 1.36733 6.01324 1.81985 5.56042C2.27234 5.10763 2.87838 4.79575 3.53345 4.74568C4.14741 4.69875 4.78777 4.88342 5.36191 5.36916C5.42365 4.61997 5.74529 4.03689 6.21218 3.63604C6.71014 3.2085 7.35906 3 7.99986 3C8.64067 3 9.28958 3.2085 9.7875 3.63604C10.2544 4.03695 10.5761 4.62013 10.6378 5.36946ZM8.11893 11.7364L8.11881 11.733H8.11902L8.11893 11.7364ZM7.8808 11.7364L7.88071 11.733H7.88091L7.8808 11.7364ZM9.95401 8.12502C9.88282 8.12502 9.85818 8.2278 9.90355 8.28223C9.98387 8.37865 10.0322 8.50271 10.0322 8.63805C10.0322 8.94516 9.78333 9.19412 9.47626 9.19412C9.16912 9.19412 8.92015 8.94516 8.92015 8.63805C8.92015 8.62163 8.89871 8.61346 8.88903 8.62677C8.80132 8.74723 8.74211 8.88245 8.71778 9.02444C8.70409 9.10438 8.6391 9.17069 8.55744 9.17069H8.51234C8.40575 9.17069 8.31783 9.08423 8.33356 8.97953C8.44139 8.26205 9.14852 7.74168 9.95401 7.74168C10.7594 7.74168 11.4666 8.26205 11.5744 8.97953C11.59 9.08423 11.5022 9.17069 11.3956 9.17069C11.289 9.17069 11.2046 9.08379 11.1814 8.98046C11.076 8.51017 10.5873 8.12502 9.95401 8.12502ZM5.01605 8.63805C5.01605 8.61638 4.98796 8.60475 4.97474 8.622C4.88099 8.74433 4.81711 8.88288 4.79007 9.02889C4.77411 9.1151 4.70394 9.18684 4.61564 9.18684H4.58255C4.47596 9.18684 4.38804 9.10041 4.40375 8.99572C4.51153 8.27785 5.21874 7.75786 6.02417 7.75786C6.82959 7.75786 7.5368 8.27785 7.64458 8.99572C7.6603 9.10041 7.57237 9.18684 7.46579 9.18684C7.35922 9.18684 7.27481 9.10001 7.25167 8.99666C7.1463 8.52608 6.6576 8.14121 6.02417 8.14121C5.96659 8.14121 5.94552 8.22205 5.98406 8.26452C6.07362 8.36323 6.12819 8.49428 6.12819 8.63805C6.12819 8.94516 5.87923 9.19412 5.57212 9.19412C5.265 9.19412 5.01605 8.94516 5.01605 8.63805ZM8.61846 9.9791C8.69379 9.90419 8.8102 9.86779 8.90373 9.91849C8.99726 9.96931 9.03274 10.0871 8.96534 10.1692C8.74582 10.4361 8.39038 10.6054 7.99837 10.6054C7.60657 10.6054 7.25035 10.438 7.03054 10.1689C6.96337 10.0867 6.9993 9.96891 7.09301 9.91849C7.18672 9.86806 7.30295 9.90499 7.37817 9.9799C7.52307 10.1244 7.74295 10.2221 7.99837 10.2221C8.25313 10.2221 8.47325 10.1234 8.61846 9.9791Z"
              fill="#718096"
            />
          </g>
          <defs>
            <clipPath id="clip0_3863_8438">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
      );
      name = 'Lens';
      break;
    case SocialPlatform.Farcaster:
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4.05917 2H11.7988V14H10.6627V8.50323H10.6516C10.526 6.98405 9.35502 5.79355 7.92899 5.79355C6.50297 5.79355 5.33197 6.98405 5.20641 8.50323H5.19527V14H4.05917V2Z"
            fill="#718096"
          />
          <path
            d="M2 3.70323L2.46154 5.40645H2.85207V12.2968C2.65599 12.2968 2.49704 12.4701 2.49704 12.6839V13.1484H2.42604C2.22996 13.1484 2.07101 13.3217 2.07101 13.5355V14H6.04734V13.5355C6.04734 13.3217 5.88839 13.1484 5.69231 13.1484H5.6213V12.6839C5.6213 12.4701 5.46235 12.2968 5.26627 12.2968H4.84024V3.70323H2Z"
            fill="#718096"
          />
          <path
            d="M10.7337 12.2968C10.5377 12.2968 10.3787 12.4701 10.3787 12.6839V13.1484H10.3077C10.1116 13.1484 9.95266 13.3217 9.95266 13.5355V14H13.929V13.5355C13.929 13.3217 13.77 13.1484 13.574 13.1484H13.503V12.6839C13.503 12.4701 13.344 12.2968 13.1479 12.2968V5.40645H13.5385L14 3.70323H11.1598V12.2968H10.7337Z"
            fill="#718096"
          />
        </svg>
      );
      name = 'Farcaster';
      break;
    default:
      break;
  }
  return (
    <div
      className={cn('flex items-center gap-[5px]', className)}
      {...wrapperProps}
    >
      {icon}
      <div className="text-[#718096] text-[12px] font-normal">{name}</div>
    </div>
  );
}

const PostCardUserInfoWrapper = styled.div`
  /* flex: 1; */
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
  button {
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
export function PostCardActionsWrapper(props: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn('flex items-center gap-[15px]', 'max-sm:gap-[10px]')}
      {...props}
    />
  );
}

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
