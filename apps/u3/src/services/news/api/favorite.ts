/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 14:27:40
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-06 16:10:11
 * @Description: file description
 */
import { ContentsListResponse } from '../types/contents';
import { DappFavoriteListResponse } from '../../dapp/types/dapp';
import { EventExploreListResponse } from '../types/event';
import { UserGroupFavoritesResponse } from '../types/favorite';
import request, { RequestPromise } from '../../shared/api/request';

export function fetchUserFavoritesByGroup(): RequestPromise<UserGroupFavoritesResponse> {
  return request({
    url: `/uniprojects/favors`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

export function fetchContentFavorites(
  urls: string[]
): RequestPromise<ContentsListResponse> {
  return request({
    url: `/contents/indexing`,
    method: 'post',
    data: {
      urls,
    },
    headers: {
      needToken: true,
    },
  });
}

export function fetchDappFavorites(
  urls: string[]
): RequestPromise<DappFavoriteListResponse> {
  return request({
    url: `/dapps/indexing`,
    method: 'post',
    data: {
      urls,
    },
    headers: {
      needToken: true,
    },
  });
}

export function fetchEventFavorites(
  urls: string[]
): RequestPromise<EventExploreListResponse> {
  return request({
    url: `/events/indexing`,
    method: 'post',
    data: {
      urls,
    },
    headers: {
      needToken: true,
    },
  });
}
