import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
import { REACT_APP_API_SOCIAL_URL } from '../constants';
import { LensPublication } from './lens';
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
  | { data: LensPublication; platform: SocailPlatform.Lens };

export type FeedsPageInfo = {
  endLensCursor: string;
  endFarcasterCursor: string;
  hasNextPage: boolean;
};

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
      pageSize,
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
      pageSize,
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
      pageSize,
      keyword,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      platforms,
    },
  });
}
