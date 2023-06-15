/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:07:10
 * @Description: file description
 */
import {
  FetchOneDappResponse,
  DappExploreListParams,
  DappExploreListResponse,
  DappFavorHandleResponse,
  UpdateDappData,
  UpdateDappResponse,
} from '../types/dapp';
import request, { RequestPromise } from './request';

export function fetchListForDappExplore(
  params: DappExploreListParams
): RequestPromise<DappExploreListResponse> {
  return request({
    url: `/dapps/searching`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}
export function fetchOneDapp(
  id: string | number
): RequestPromise<FetchOneDappResponse> {
  return request({
    url: `/dapps/${id}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}
export function favorDapp(id: number): RequestPromise<DappFavorHandleResponse> {
  return request({
    url: `/dapps/${id}/favors`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

export function unfavorDapp(
  id: number
): RequestPromise<DappFavorHandleResponse> {
  return request({
    url: `/dapps/${id}/favors`,
    method: 'delete',
    headers: {
      needToken: true,
    },
  });
}

export function updateDapp(
  id: string | number,
  data: Partial<UpdateDappData>
): RequestPromise<UpdateDappResponse> {
  return request({
    url: `/dapps/${id}`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}

export function createDapp(
  data: UpdateDappData
): RequestPromise<UpdateDappResponse> {
  return request({
    url: `/dapps`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}
