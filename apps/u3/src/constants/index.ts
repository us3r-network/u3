/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-19 14:55:28
 * @Description: 系统相关常量定义
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const API_SCAN_URL = 'https://cscan.onrender.com';
export const MEDIA_BREAK_POINTS = {
  xs: 320,
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1024,
  xxl: 1280,
  xxxl: 1440,
};
export const MOBILE_BREAK_POINT = 768;

export const CHROME_EXTENSION_URL = process.env.REACT_APP_CHROME_EXTENSION_URL;

export const UPLOAD_IMAGE_SIZE_LIMIT = 500 * 1024;

export const U3_HOST_URI = window.location.host;

export const CERAMIC_HOST = process.env.REACT_APP_CERAMIC_HOST;

export const FamilyOrAppMap = {
  'Gitcoin Passport':
    'kjzl6cwe1jw148h1e14jb5fkf55xmqhmyorp29r9cq356c7ou74ulowf8czjlzs',
};

export const FamilyOrAppMapReverse = Object.fromEntries(
  Object.entries(FamilyOrAppMap).map(([key, value]) => [value, key])
);

export const Types: { [key: string]: string } = {
  '0': 'TileDocument',
  '1': 'Caip10Link',
  '2': 'Model',
  '3': 'ModelInstanceDocument',
};
