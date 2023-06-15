/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-23 11:24:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:20:45
 * @Description: file description
 */
import dayjs from 'dayjs';

export const formatDateTime = (timestramp: number) => {
  return new Date(timestramp).toLocaleString('en-US', {
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const defaultFormatDate = (date: string | number | Date) =>
  dayjs(date).format('YYYY/MM/DD');

export const defaultFormatFromNow = (date: string | number | Date) =>
  dayjs(date).fromNow();
