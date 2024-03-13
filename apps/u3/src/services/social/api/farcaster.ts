import axios, { AxiosPromise } from 'axios';
import { UrlMetadata } from '@mod-protocol/core';
import { ApiResp, FarCast, FarCastEmbedMeta, SocialPlatform } from '../types';
import { REACT_APP_API_SOCIAL_URL } from '../../../constants';
import request from '@/services/shared/api/request';
import { FollowType } from '@/container/profile/Contacts';
import { NotificationType } from '@/services/notification/types/notifications';

// console.log({ REACT_APP_API_SOCIAL_URL });
export const PAGE_SIZE = 25;
export type FarcasterNotification = {
  type: NotificationType;
  message_fid: number;
  message_type: number;
  message_timestamp: string;
  message_hash: Buffer;
  userData: unknown;
  reactions_type?: number;
  casts_id?: string;
  casts_hash?: Buffer;
  casts_text?: string;
  replies_text?: string;
  replies_hash?: Buffer;
  replies_parent_hash?: Buffer;
  casts_mentions?: number[];
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/embed`,
    method: 'get',
    params: {
      urls,
      timeout: 3000,
      maxRedirects: 2,
    },
  });
}

export function getFarcasterEmbedCast({
  fid,
  hash,
}: {
  fid: number;
  hash: string;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/embed-cast`,
    method: 'get',
    params: {
      fid,
      hash,
    },
  });
}

export function getFarcasterNotifications({
  fid,
  type,
  endFarcasterCursor,
  pageSize,
}: {
  fid: number;
  type: NotificationType[];
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/notifications`,
    method: 'get',
    params: {
      fid,
      type,
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/notifications/unreadCount`,
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/notifications/clearUnread`,
    method: 'post',
    data: {
      fid,
    },
  });
}

export function getFarcasterUserStats(fid: string | number): AxiosPromise<
  ApiResp<{
    followerCount: number;
    followingCount: number;
    postCount: number;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/statics`,
    method: 'get',
    params: {
      fid,
    },
  });
}

export type FarcasterLink = {
  fid: number;
  targetFid: number;
  type: number;
};

export function getFarcasterUserLinks({
  fid,
  type,
  pageSize,
  endCursor,
}: {
  fid: string | number;
  type: FollowType;
  endCursor?: string;
  pageSize?: number;
}): AxiosPromise<
  ApiResp<{
    links: FarcasterLink[];
    farcasterUserData: FarcasterUserData[];
    pageInfo: FarcasterPageInfo;
  }>
> {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/followLinks`,
    method: 'get',
    params: {
      fid,
      type,
      pageSize,
      endCursor,
    },
  });
}

export function getLinkFeeds({
  link,
  pageSize,
  keyword,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
  platforms,
}: {
  link: string;
  pageSize?: number;
  keyword?: string;
  endFarcasterCursor?: string;
  endLensCursor?: string;
  activeLensProfileId?: string;
  platforms?: SocialPlatform[];
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/castWithEmbedLinks`,
    method: 'get',
    params: {
      link,
      pageSize,
      keyword,
      endCursor: endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      platforms,
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
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/recommendedProfile`,
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
    data: {
      parent_url: string;
      rootParentUrl: string;
      count: string;
      followerCount: string;
    }[];
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
  channelId,
}: {
  start: number;
  end: number;
  least?: number;
  channelId?: string;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/trending`,
    method: 'get',
    params: {
      startIndex: start,
      endIndex: end,
      ...(least ? { least } : {}),
      channelId: channelId ?? '',
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

export function getFarcasterChannels() {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/channels`,
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

const REACT_APP_API_SOCIAL_URL_PROD = 'https://api.u3.xyz';
export async function getSavedCasts(walletAddress: string, pageSize?: number) {
  if (walletAddress.startsWith('0x')) {
    walletAddress = walletAddress.slice(2);
  }
  const resp = await request({
    url: `${REACT_APP_API_SOCIAL_URL_PROD}/3r-bot/saved-casts`,
    method: 'get',
    params: {
      walletAddress,
      pageSize,
    },
  });
  return resp?.data?.data?.saves;
}

export function setSavedCastsSynced(walletAddress: string, lastedId: number) {
  if (walletAddress.startsWith('0x')) {
    walletAddress = walletAddress.slice(2);
  }
  return request({
    url: `${REACT_APP_API_SOCIAL_URL_PROD}/3r-bot/sync-casts`,
    method: 'post',
    data: {
      walletAddress,
      lastedId,
    },
    headers: {
      needToken: true,
    },
  });
}

export function getUserinfoWithFid(fid: string) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/userinfo/fid/${fid}`,
    method: 'get',
  });
}

export function getUserDegenTipAllowance(addr: string) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/degen-tip/allowance?address=${addr}`,
    method: 'get',
  });
}

export function postFrameActionApi(data: any) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/frame-action/proxy`,
    method: 'post',
    data,
  });
}

export function postFrameActionRedirectApi(data: any) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/frame-action-redirect/proxy`,
    method: 'post',
    data,
  });
}

export function notifyTipApi(data: {
  txHash: string;
  amount: number;
  fromFid: number;
  type: string;
  castHash: string;
}) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-bot/tip/notify`,
    method: 'post',
    data,
  });
}

export function getCastTipsDetail(castHash: string) {
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/${castHash}/tips`,
    method: 'get',
  });
}

export function getClaimStatusApi() {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/onboarding/activity1/status`,
    headers: {
      needToken: true,
    },
  });
}

export function claimRewardApi() {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/onboarding/activity1/claim`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

export function redEnvelopeClaimCheck() {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/onboarding/red-envelopes/unclaimed`,
    headers: {
      needToken: true,
    },
  });
}

export function claimRedEnvelope() {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/onboarding/red-envelopes/claim`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

export function fetchFidWithVerificationAddress(address: string) {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/fid?address=${address}`,
    method: 'get',
  });
}

export function fetchFidSigners(fid: string) {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/fid/signers?fid=${fid}`,
    method: 'get',
  });
}

export function fetchSignerWithPubkey(pubkey: string) {
  return request({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-farcaster/signers/${pubkey}`,
    method: 'get',
  });
}
