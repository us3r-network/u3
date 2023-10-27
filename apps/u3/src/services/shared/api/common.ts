/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 13:03:00
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 18:19:09
 * @Description: file description
 */
// 获取所有Platform
import { ConfigTopicsResponse, PlatformsResponse } from '../types/common';
import request, { RequestPromise } from './request';

export function getAllPlatform(): RequestPromise<PlatformsResponse> {
  return request({
    url: `/uniprojects/platforms`,
    method: 'get',
  });
}
export function getConfigsTopics(): RequestPromise<ConfigTopicsResponse> {
  return request({
    url: `/configs/topics`,
    method: 'get',
  });
}
