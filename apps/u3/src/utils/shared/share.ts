/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-15 17:21:55
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-23 11:34:10
 * @Description: file description
 */
import { SHARE_DOMAIN } from '../../constants';

export const getEventShareUrl = (id: string | number) => {
  return `${SHARE_DOMAIN}/events/${id}`;
};
export const getProjectShareUrl = (id: string | number) => {
  return `${SHARE_DOMAIN}/projects/${id}`;
};
export const getDappShareUrl = (id: string | number) => {
  return `${SHARE_DOMAIN}/dapps/${id}`;
};

export const getContentShareUrl = (id: string | number) => {
  return `${SHARE_DOMAIN}/contents/${id}`;
};

export const getLinkShareUrl = (url: string) => {
  return `${SHARE_DOMAIN}/links/${Buffer.from(url, 'utf8').toString('base64')}`;
};

export const getSocialDetailShareUrlWithLens = (id: string | number) => {
  return `${SHARE_DOMAIN}/social/post-detail/lens/${id}`;
};

export const getSocialDetailShareUrlWithFarcaster = (id: string | number) => {
  return `${SHARE_DOMAIN}/social/post-detail/fcast/${id}`;
};
