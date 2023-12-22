import axios, { AxiosPromise } from 'axios';
import { UrlMetadata } from '@mod-protocol/core';
import { ApiResp, FarCast, FarCastEmbedMeta } from '../types';
import { REACT_APP_API_SOCIAL_URL } from '../../../constants';
import request from '@/services/shared/api/request';

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
  endTimestamp: number;
  endCursor: string;
  endFarcasterCursor: string;
  hasNextPage: boolean;
};

export type FarcasterUserData = {
  fid: string;
  type: number;
  value: string;
};

export function getFarcasterUserInfo(
  fids: number[]
): AxiosPromise<ApiResp<FarcasterUserData[]>> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/userinfo`,
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/cast/${hash}`,
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
      timeout: 3000,
      maxRedirects: 2,
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/follow`,
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/links`,
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
  channelId,
  endTimestamp,
  endCursor,
  pageSize,
}: {
  channelId: string;
  endTimestamp?: number;
  endCursor?: string;
  pageSize?: number;
}): AxiosPromise<
  ApiResp<{
    data: { data: FarCast; platform: 'farcaster' }[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/channel`,
    method: 'get',
    params: {
      name: '',
      channelId,
      endTimestamp,
      endCursor,
      pageSize,
    },
  });
}

export function getFarcasterChannelTrends(limit = 500): AxiosPromise<
  ApiResp<{
    data: { parent_url: string; rootParentUrl: string; count: string }[];
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/channel/trends`,
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

export function unPinFarcasterChannel(
  fid: string | number,
  parent_url: string
) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/farcaster/user/channels`,
    method: 'post',
    data: {
      fid,
      parent_url,
      platform: 'farcaster',
      isDelete: true,
    },
  });
}

export function getFarcasterTrending({
  start,
  end,
  least,
}: {
  start: number;
  end: number;
  least?: number;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/trending`,
    method: 'get',
    params: {
      startIndex: start,
      endIndex: end,
      ...(least ? { least } : {}),
    },
  });
}

export function getFarcasterWhatsnew(endTimestamp: number, endCursor?: string) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/whatsnew`,
    method: 'get',
    params: {
      endCursor: endCursor ?? '',
      endTimestamp,
    },
  });
}

export function getFarcasterFollowing(
  fid: number,
  endTimestamp: number,
  endCursor?: string
) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/following`,
    method: 'get',
    params: {
      fid,
      endCursor: endCursor ?? '',
      endTimestamp,
    },
  });
}

export function getFnames(fid: number): AxiosPromise<
  ApiResp<{
    username: string;
    type: number;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/fnames`,
    method: 'get',
    params: {
      fid,
    },
  });
}

export function getFarcasterUserInfoWithFname(fname): AxiosPromise<{
  fid: number;
  name: string;
  owner: string;
  type: string;
  signature: string;
}> {
  return axios({
    url: `https://api.farcaster.u3.xyz/v1/userNameProofByName?name=${fname}`,
    method: 'get',
  });
}

export function pinupCastApi(hash: string, unpinup?: boolean) {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/pinup/${hash}`,
    method: 'post',
    params: {
      unpinup,
    },
    headers: {
      needToken: true,
    },
  });
}

export function getPinupHashes() {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/pinup-hashes`,
    method: 'get',
  });
}

export async function getMetadataWithMod(
  urls: string[]
): Promise<{ [key: string]: UrlMetadata }> {
  const resp = await fetch(
    'https://api.modprotocol.org/api/cast-embeds-metadata/by-url',
    {
      body: JSON.stringify(urls),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const metadata = await resp.json();
  return metadata;
}
