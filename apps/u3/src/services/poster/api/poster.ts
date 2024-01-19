import { PosterEntity, PosterPageInfo } from '../types/poster';
import request, { RequestPromise } from '../../shared/api/request';
import { ApiResp } from '@/services/shared/types';

export type FetchPosterListParams = {
  pageSize?: number;
  endCursor?: number;
};
export type FetchPosterListResponse = {
  posters: PosterEntity[];
  pageInfo: PosterPageInfo;
};
export function fetchPosterList(
  params: FetchPosterListParams
): RequestPromise<ApiResp<FetchPosterListResponse>> {
  return request({
    url: `/posters`,
    method: 'get',
    params,
  });
}
