/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-19 14:55:28
 * @Description: 系统相关常量定义
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
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

export const WALLET_CONNECT_PROJECT_ID =
  process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID ||
  'c652d0148879353d7e965d7f6f361e59';

export const AIRSTACK_API_KEY =
  process.env.REACT_APP_AIRSTACK_API_KEY || '135391e4df1d47fa898d43c9f4b27329';

export const REACT_APP_API_SOCIAL_URL =
  process.env.REACT_APP_API_SOCIAL_URL || 'https://api.u3.xyz';
