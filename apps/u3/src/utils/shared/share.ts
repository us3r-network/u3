/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-15 17:21:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:55:12
 * @Description: file description
 */
import { U3_HOST_URI, SHARE_DOMAIN } from '../../constants';

export const getEventShareUrl = (id: string | number) => {
  return `${SHARE_DOMAIN}/events/${id}`;
};
export const getProjectShareUrl = (id: string | number) => {
  return `${U3_HOST_URI}/projects/${id}`;
};
export const getDappShareUrl = (id: string | number) => {
  return `${U3_HOST_URI}/dapps/${id}`;
};

export const getContentShareUrl = (id: string | number) => {
  return `${SHARE_DOMAIN}/contents/${id}`;
};

export const getSocialDetailShareUrlWithLens = (id: string | number) => {
  return `${SHARE_DOMAIN}/social/post-detail/lens/${id}`;
};

export const getSocialDetailShareUrlWithFarcaster = (id: string | number) => {
  return `${SHARE_DOMAIN}/social/post-detail/fcast/${id}`;
};
