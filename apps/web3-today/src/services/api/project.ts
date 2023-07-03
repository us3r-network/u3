/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 13:53:17
 * @Description: file description
 */
import {
  ProjectExploreListParams,
  ProjectExploreListResponse,
} from '../types/project';
import request, { RequestPromise } from './request';

export function fetchListForProjectExplore(
  params: ProjectExploreListParams
): RequestPromise<ProjectExploreListResponse> {
  return request({
    url: `/uniProjects/searching`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}
