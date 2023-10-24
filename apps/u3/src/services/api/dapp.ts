/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-24 10:29:30
 * @Description: file description
 */
import { zora1155ToMintAddress } from 'src/constants/zora';
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

export function updateDappTokenId(
  id: string | number,
  tokenId: number
): RequestPromise<UpdateDappResponse> {
  // console.log('updateDappTokenId', id, tokenId);
  return request({
    url: `/dapps/${id}/tokens`,
    method: 'post',
    data: { tokenId },
    headers: {
      needToken: true,
    },
  });
}
export function fetchDappByTokenId(
  tokenId: number
): RequestPromise<FetchOneDappResponse> {
  return request({
    url: `/dapps/${zora1155ToMintAddress}/${tokenId}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}
