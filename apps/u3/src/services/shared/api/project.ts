/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 13:53:17
 * @Description: file description
 */
import {
  FetchOneProjectResponse,
  ProjectExploreListParams,
  ProjectExploreListResponse,
  ProjectFavorHandleResponse,
  UpdateProjectData,
  UpdateProjectResponse,
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
export function fetchOneProject(
  id: string | number
): RequestPromise<FetchOneProjectResponse> {
  return request({
    url: `/uniProjects/${id}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}
export function favorProject(
  id: number
): RequestPromise<ProjectFavorHandleResponse> {
  return request({
    url: `/uniProjects/${id}/favors`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}

export function unfavorProject(
  id: number
): RequestPromise<ProjectFavorHandleResponse> {
  return request({
    url: `/uniProjects/${id}/favors`,
    method: 'delete',
    headers: {
      needToken: true,
    },
  });
}

export function updateProject(
  id: string | number,
  data: Partial<UpdateProjectData>
): RequestPromise<UpdateProjectResponse> {
  return request({
    url: `/uniProjects/${id}`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}

export function createProject(
  data: UpdateProjectData
): RequestPromise<UpdateProjectResponse> {
  return request({
    url: `/uniProjects`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}
