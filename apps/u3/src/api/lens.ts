import axios, { AxiosPromise } from 'axios';
import { Mirror, Post, Comment } from '@lens-protocol/react-web';

import { API_BASE_URL } from '../constants';
import { ApiResp } from '.';

export type LensPost = Post & {
  timestamp?: number;
};

export type LensMirror = Mirror & {
  timestamp?: number;
};

export type LensComment = Comment & {
  timestamp?: number;
};

export const getLensFeeds = (opts?: {
  pageSize?: number;
  endLensCursor?: string;
  activeLensProfileId?: string;
  keyword?: string;
}): AxiosPromise<
  ApiResp<{
    data: { data: LensPost; platform: 'lens' }[];
    pageInfo: {
      endLensCursor: string;
      hasNextPage: boolean;
    };
  }>
> => {
  return axios.request({
    url: `${API_BASE_URL}/3r/lens/feeds`,
    method: 'GET',
    params: {
      pageSize: opts?.pageSize ?? 10,
      endLensCursor: opts?.endLensCursor ?? '',
      activeLensProfileId: opts?.activeLensProfileId ?? '',
      keyword: opts?.keyword ?? '',
    },
  });
};
