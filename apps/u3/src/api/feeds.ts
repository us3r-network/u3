import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
import { REACT_APP_API_SOCIAL_URL } from '../constants';
import { LensComment, LensMirror, LensPost } from './lens';
import { ApiResp, FarCast, SocailPlatform } from '.';

// axios 实例
const axiosInstance = axios.create();

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 2、get请求，params参数序列化
    if (config.method === 'get') {
      config.paramsSerializer = (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' });
    }
    return config;
  },
  (error) =>
    // 对请求错误做些什么
    Promise.reject(error)
);

export type FeedsDataItem =
  | { data: FarCast; platform: SocailPlatform.Farcaster }
  | { data: LensPost; platform: SocailPlatform.Lens };

export type ProfileFeedsDataItem =
  | { data: FarCast; platform: SocailPlatform.Farcaster }
  | { data: LensPost; platform: SocailPlatform.Lens }
  | { data: LensMirror; platform: SocailPlatform.Lens }
  | { data: LensComment; platform: SocailPlatform.Lens };

export type FeedsPageInfo = {
  endLensCursor: string;
  endFarcasterCursor: string;
  hasNextPage: boolean;
};

export enum ProfileFeedsGroups {
  POSTS = 'posts',
  LIKES = 'likes',
  REPOSTS = 'reposts',
  REPLIES = 'replies',
}

export const FEEDS_PAGE_SIZE = 30;

export function getFeeds({
  pageSize,
  keyword,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
  platforms,
}: {
  pageSize?: number;
  keyword?: string;
  endFarcasterCursor?: string;
  endLensCursor?: string;
  activeLensProfileId?: string;
  platforms?: SocailPlatform[];
}): AxiosPromise<
  ApiResp<{
    data: FeedsDataItem[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: FeedsPageInfo;
  }>
> {
  return axiosInstance({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/feeds`,
    method: 'get',
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      keyword,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      platforms,
    },
  });
}

export function getFollowingFeeds({
  pageSize,
  keyword,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
  address,
  fid,
  platforms,
}: {
  pageSize?: number;
  keyword?: string;
  endFarcasterCursor?: string;
  endLensCursor?: string;
  activeLensProfileId?: string;
  address?: string;
  fid?: string;
  platforms?: SocailPlatform[];
}): AxiosPromise<
  ApiResp<{
    data: FeedsDataItem[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: FeedsPageInfo;
  }>
> {
  return axiosInstance({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/followingFeeds`,
    method: 'get',
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      keyword,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      address,
      fid,
      platforms,
    },
  });
}

export function getTrendingFeeds({
  pageSize,
  keyword,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
  platforms,
}: {
  pageSize?: number;
  keyword?: string;
  endFarcasterCursor?: string;
  endLensCursor?: string;
  activeLensProfileId?: string;
  platforms?: SocailPlatform[];
}): AxiosPromise<
  ApiResp<{
    data: FeedsDataItem[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: FeedsPageInfo;
  }>
> {
  return axiosInstance({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/trendingFeeds`,
    method: 'get',
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      keyword,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      platforms,
    },
  });
}

export function getProfileFeeds({
  pageSize,
  keyword,
  group,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
  lensProfileId,
  fid,
  platforms,
}: {
  pageSize?: number;
  keyword?: string;
  group?: ProfileFeedsGroups;
  endFarcasterCursor?: string;
  endLensCursor?: string;
  activeLensProfileId?: string;
  lensProfileId?: string;
  fid?: string;
  platforms?: SocailPlatform[];
}): AxiosPromise<
  ApiResp<{
    data: ProfileFeedsDataItem[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: FeedsPageInfo;
  }>
> {
  return axiosInstance({
    url: `${REACT_APP_API_SOCIAL_URL}/3r/profileFeeds`,
    method: 'get',
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      keyword,
      group,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      lensProfileId,
      fid,
      platforms,
    },
  });
}
