/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-15 17:21:55
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:55:12
 * @Description: file description
 */
import { U3_HOST_URI } from '../constants';

export const getEventShareUrl = (id: string | number) => {
  return `${U3_HOST_URI}/events/${id}`;
};

export const getContentShareUrl = (id: string | number) => {
  return `${U3_HOST_URI}/contents/${id}`;
};
