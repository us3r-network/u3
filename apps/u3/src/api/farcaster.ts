import axios, { AxiosPromise } from 'axios';
import { ApiResp, FarCast, FarCastEmbedMeta } from '.';
import { REACT_APP_API_SOCIAL_URL } from '../constants';

// console.log({ REACT_APP_API_SOCIAL_URL });

export type FarcasterNotification = {
  message_fid: number;
  message_type: number;
  message_timestamp: string;
  message_hash: Buffer;
  reaction_type?: number;
  id?: string;
  hash?: Buffer;
  text?: string;
  userData: unknown;
  parent_hash?: Buffer;
};

export type FarcasterPageInfo = {
  endFarcasterCursor: string;
  hasNextPage: boolean;
};

export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};

export function getFarcasterFeeds({
  endFarcasterCursor,
  pageSize,
}: {
  endFarcasterCursor?: string;
  pageSize?: number;
}): AxiosPromise<
  ApiResp<{
    data: { data: FarCast; platform: 'farcaster' }[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcasts`,
    method: 'get',
    params: {
      endFarcasterCursor,
      pageSize,
    },
  });
}

export function getFarcasterUserInfo(
  fids: number[]
): AxiosPromise<ApiResp<FarcasterUserData[]>> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/userinfo`,
    method: 'get',
    params: {
      fids,
    },
  });
}

export function getFarcasterCastInfo(
  hash: string,
  {
    endFarcasterCursor,
    pageSize,
  }: {
    endFarcasterCursor?: string;
    pageSize?: number;
  }
): AxiosPromise<
  ApiResp<{
    cast: FarCast;
    comments: { data: FarCast; platform: 'farcaster' }[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/cast/${hash}`,
    method: 'get',
    params: {
      endFarcasterCursor,
      pageSize,
    },
  });
}

export function getFarcasterSignature(key: string): AxiosPromise<
  ApiResp<{
    signature: `0x${string}`;
    appFid: number;
    deadline: number;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/signature/${key}`,
    method: 'get',
  });
}

export function getFarcasterEmbedMetadata(urls: string[]): AxiosPromise<
  ApiResp<{
    metadata: (null | FarCastEmbedMeta)[];
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/embed`,
    method: 'get',
    params: {
      urls,
    },
  });
}

export function getFarcasterNotifications({
  fid,
  endFarcasterCursor,
  pageSize,
}: {
  fid: number;
  endFarcasterCursor?: string;
  pageSize?: number;
}): AxiosPromise<
  ApiResp<{
    notifications: FarcasterNotification[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/notifications`,
    method: 'get',
    params: {
      fid,
      pageSize,
      next: endFarcasterCursor,
      withInfo: true,
    },
  });
}

export function getFarcasterUnreadNotificationCount({
  fid,
}: {
  fid: number;
}): AxiosPromise<
  ApiResp<{
    count: number;
    lastTime: string | null;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/notifications/unreadCount`,
    method: 'get',
    params: {
      fid,
    },
  });
}

export function clearFarcasterUnreadNotification({
  fid,
}: {
  fid: number;
}): AxiosPromise<
  ApiResp<{
    lastTime: string;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/notifications/clearUnread`,
    method: 'post',
    data: {
      fid,
    },
  });
}

export function getFarcasterFollow(fid: string | number): AxiosPromise<
  ApiResp<{
    followers: number;
    following: number;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/follow`,
    method: 'get',
    params: {
      fid,
    },
  });
}

export function getFarcasterLinks(
  fid: string | number,
  withInfo = false
): AxiosPromise<
  ApiResp<{
    followerCount: number;
    followingCount: number;
    followerData: string[];
    followingData: string[];
    farcasterUserData: { fid: string; type: number; value: string }[];
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/links`,
    method: 'get',
    params: {
      fid,
      withInfo,
    },
  });
}

export function getFarcasterRecommendedProfile(
  fid: string | number,
  num = 5
): AxiosPromise<
  ApiResp<{
    recommendedFids: string[];
    farcasterUserData: { fid: string; type: number; value: string }[];
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/recommendedProfile`,
    method: 'get',
    params: {
      fid,
      num,
    },
  });
}

export function getFarcasterChannelFeeds({
  channelName,
  endFarcasterCursor,
  pageSize,
}: {
  channelName: string;
  endFarcasterCursor?: string;
  pageSize?: number;
}): AxiosPromise<
  ApiResp<{
    data: { data: FarCast; platform: 'farcaster' }[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/channel`,
    method: 'get',
    params: {
      name: channelName,
      endFarcasterCursor,
      pageSize,
    },
  });
}

export function getFarcasterChannelTrends(
  limit = 500
): AxiosPromise<ApiResp<{ parent_url: string; count: string }[]>> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/channel/trends`,
    method: 'get',
    params: {
      limit,
    },
  });
}

export function getUserChannels(fid: string | number) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/user/channels?fid=${fid}`,
    method: 'get',
  });
}

export function pinFarcasterChannel(fid: string | number, parent_url: string) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/user/channels`,
    method: 'post',
    data: {
      fid,
      parent_url,
      platform: 'farcaster',
    },
  });
}
