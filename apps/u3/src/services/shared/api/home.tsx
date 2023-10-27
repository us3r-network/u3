/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 10:22:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 15:09:21
 * @Description: file description
 */
import { PlatformDataResponse } from '../types/home';
import { DappExploreListResponse } from '../../dapp/types/dapp';
import request, { RequestPromise } from './request';

export function getPlatforms(): RequestPromise<PlatformDataResponse> {
  return request({
    url: `/uniprojects/platforms`,
  });
}

export function getTrendingContents() {
  return request({
    url: `/contents/searching`,
    params: {
      pageSize: 6,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'TRENDING',
    },
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

export function getTrendingEvents() {
  return request({
    url: `/events/searching`,
    method: 'get',
    params: {
      pageSize: 14,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'FORU',
    },
    headers: {
      needToken: true,
    },
  });
}

export function getTrendingDapps(): RequestPromise<DappExploreListResponse> {
  return request({
    url: `/dapps/searching`,
    params: {
      pageSize: 6,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'TRENDING',
    },
    method: 'get',
  });
}
