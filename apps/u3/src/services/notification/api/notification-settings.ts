import request, { RequestPromise } from '../../shared/api/request';
import { ApiResp } from '@/services/shared/types';
import {
  NotificationSetting,
  NotificationSettingType,
} from '../types/notification-settings';

export function fethNotificationSettings(): RequestPromise<
  ApiResp<NotificationSetting[]>
> {
  return request({
    url: `/notifications/settings`,
    method: 'get',
    headers: {
      needToken: true,
    },
  });
}

export function addNotificationSetting(params: {
  type: NotificationSettingType;
  fid?: string;
  subscription?: string;
}): RequestPromise<ApiResp<NotificationSetting>> {
  return request({
    url: `/notifications/settings`,
    method: 'post',
    headers: {
      needToken: true,
    },
    data: params,
  });
}

export function updateNotificationSetting(
  id: number,
  data: {
    id: number;
    type: NotificationSettingType;
    enabled?: boolean;
    fid?: string;
    subscription?: string;
  }
): RequestPromise<ApiResp<NotificationSetting>> {
  return request({
    url: `/notifications/settings/${id}`,
    method: 'post',
    headers: {
      needToken: true,
    },
    data,
  });
}

export function deleteNotificationSetting(
  id: number
): RequestPromise<ApiResp<NotificationSetting>> {
  return request({
    url: `/notifications/setting/${id}`,
    method: 'delete',
    headers: {
      needToken: true,
    },
  });
}
