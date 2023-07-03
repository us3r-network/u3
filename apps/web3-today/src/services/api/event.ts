/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 11:24:11
 * @Description: file description
 */
import axios, { AxiosPromise } from 'axios';
import { isArray, isNumber } from 'lodash';
import qs from 'qs';
import {
  CreateEventData,
  CreateEventResponse,
  EventExploreListParams,
  EventExploreListResponse,
  EventFavorHandleResponse,
  FetchOneEventResponse,
} from '../types/event';
import request, { RequestPromise } from './request';

export function fetchListForEventExplore(
  params: EventExploreListParams
): RequestPromise<EventExploreListResponse> {
  return request({
    url: `/events/searching`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}
export function fetchListForEventComplete(
  params: EventExploreListParams
): RequestPromise<EventExploreListResponse> {
  return request({
    url: `/events/completings`,
    method: 'get',
    params,
    headers: {
      needToken: true,
    },
  });
}

export function createEvent(
  data: CreateEventData
): RequestPromise<CreateEventResponse> {
  return request({
    url: `/events`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}

export function updateEvent(
  id: string | number,
  data: Partial<CreateEventData>
): RequestPromise<CreateEventResponse> {
  return request({
    url: `/events/${id}`,
    method: 'post',
    data,
    headers: {
      needToken: true,
    },
  });
}
export function fetchOneEvent(
  id: string | number
): RequestPromise<FetchOneEventResponse> {
  return request({
    url: `/events/${id}`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

export function completeEvent({
  id,
  uuid,
  isForU,
}: {
  id: number | string;
  uuid: string;
  isForU: boolean;
}): RequestPromise<EventFavorHandleResponse> {
  return request({
    url: isForU
      ? `/events/${uuid}/personlcompleting`
      : `/events/${id}/completing`,
    method: 'post',
    headers: {
      needToken: true,
    },
  });
}
