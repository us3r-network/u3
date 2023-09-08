import axios, { AxiosPromise } from 'axios';
import { ApiResp, FarCast, FarCastEmbedMeta } from '.';
import { REACT_APP_API_SOCIAL_URL } from '../constants';

// console.log({ REACT_APP_API_SOCIAL_URL });

export function getFarcasterFeeds({
  endFarcasterCursor,
  pageSize,
}: {
  endFarcasterCursor?: string;
  pageSize?: number;
}): AxiosPromise<
  ApiResp<{
    data: { data: FarCast; platform: 'farcaster' }[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: {
      endFarcasterCursor: string;
      hasNextPage: boolean;
    };
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
): AxiosPromise<ApiResp<{ type: number; value: string }[]>> {
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
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: {
      endFarcasterCursor: string;
      hasNextPage: boolean;
    };
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
