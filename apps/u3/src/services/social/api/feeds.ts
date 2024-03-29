import axios, { AxiosPromise } from 'axios';
import qs from 'qs';
import { REACT_APP_API_SOCIAL_URL } from '../../../constants';
import { LensComment, LensMirror, LensPost } from './lens';
import { ApiResp, FarCast, SocialPlatform } from '../types';

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
  | { data: FarCast; platform: SocialPlatform.Farcaster }
  | { data: LensPost; platform: SocialPlatform.Lens; version?: string };

export type ProfileFeedsDataItem =
  | { data: FarCast; platform: SocialPlatform.Farcaster }
  | { data: LensPost; platform: SocialPlatform.Lens; version?: string }
  | { data: LensMirror; platform: SocialPlatform.Lens; version?: string }
  | { data: LensComment; platform: SocialPlatform.Lens; version?: string };

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

export const FEEDS_PAGE_SIZE = 25;

export const FEEDS_SCROLL_THRESHOLD = `${FEEDS_PAGE_SIZE * 200}px`;

export function getProfileFeeds({
  pageSize,
  keyword,
  group,
  endFarcasterCursor,
  endLensCursor,
  lensProfileId,
  fid,
  platforms,
  lensAccessToken,
}: {
  pageSize?: number;
  keyword?: string;
  group?: ProfileFeedsGroups;
  endFarcasterCursor?: string;
  endLensCursor?: string;
  lensProfileId?: string;
  fid?: string;
  platforms?: SocialPlatform[];
  lensAccessToken?: string;
}): AxiosPromise<
  ApiResp<{
    data: ProfileFeedsDataItem[];
    farcasterUserData: { fid: string; type: number; value: string }[];
    pageInfo: FeedsPageInfo;
  }>
> {
  return axiosInstance({
    url: `${REACT_APP_API_SOCIAL_URL}/3r-all/profileFeeds`,
    method: 'get',
    params: {
      pageSize: pageSize || FEEDS_PAGE_SIZE,
      keyword,
      group,
      endFarcasterCursor,
      endLensCursor,
      lensProfileId,
      fid,
      platforms,
    },
    headers: {
      'Lens-Access-Token': lensAccessToken ? `Bearer ${lensAccessToken}` : '',
    },
  });
}
