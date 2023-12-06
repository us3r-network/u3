/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-22 16:24:14
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

export const SHARE_DOMAIN =
  process.env.REACT_APP_SHARE_DOMAIN || 'https://share.u3.xyz';

export const POSTER_SHARE_DOMAIN = window.location.origin;

export const SOCIAL_SHARE_TITLE = 'I found an interesting viewpoint in U3!';
export const CONTENT_SHARE_TITLE = 'I found an interesting viewpoint in U3!';
export const LINK_SHARE_TITLE = 'I found something interesting in U3!';

export const EVENT_SHARE_TITLE = 'Great event in U3!';

export const CONTACT_US_LINKS = {
  feedback: 'https://u3xyz.canny.io/',
  telegram: 'https://t.me/us3rnetwork',
  twitter: 'https://twitter.com/getus3r',
  discord: 'https://discord.gg/yDgkH4Es',
};
