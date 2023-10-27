/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-10 18:12:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-10 18:34:54
 * @Description: file description
 */

import { User } from '../../services/shared/api/login';

/**
 * reference: https://developer.mozilla.org/zh-CN/docs/Web/API/Document/cookie
 */
export const docCookies = {
  getItem(sKey) {
    return (
      decodeURIComponent(
        document.cookie.replace(
          new RegExp(
            `(?:(?:^|.*;)\\s*${encodeURIComponent(sKey).replace(
              /[-.+*]/g,
              '\\$&'
            )}\\s*\\=\\s*([^;]*).*$)|^.*$`
          ),
          '$1'
        )
      ) || null
    );
  },
  setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    // eslint-disable-next-line no-useless-escape
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
      return false;
    }
    let sExpires = '';
    if (vEnd) {
      // eslint-disable-next-line default-case
      switch (vEnd.constructor) {
        case Number:
          sExpires =
            vEnd === Infinity
              ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT'
              : `; max-age=${vEnd}`;
          break;
        case String:
          sExpires = `; expires=${vEnd}`;
          break;
        case Date:
          sExpires = `; expires=${vEnd.toUTCString()}`;
          break;
      }
    }
    document.cookie = `${encodeURIComponent(sKey)}=${encodeURIComponent(
      sValue
    )}${sExpires}${sDomain ? `; domain=${sDomain}` : ''}${
      sPath ? `; path=${sPath}` : ''
    }${bSecure ? '; secure' : ''}`;
    return true;
  },
  removeItem(sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) {
      return false;
    }
    document.cookie = `${encodeURIComponent(
      sKey
    )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${
      sDomain ? `; domain=${sDomain}` : ''
    }${sPath ? `; path=${sPath}` : ''}`;
    return true;
  },
  hasItem(sKey) {
    return new RegExp(
      `(?:^|;\\s*)${encodeURIComponent(sKey).replace(/[-.+*]/g, '\\$&')}\\s*\\=`
    ).test(document.cookie);
  },
  /* optional method: you can safely remove it! */
  keys() {
    const aKeys = document.cookie
      // eslint-disable-next-line no-useless-backreference, no-useless-escape
      .replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
      // eslint-disable-next-line no-useless-escape
      .split(/\s*(?:\=[^;]*)?;\s*/);
    for (let nIdx = 0; nIdx < aKeys.length; nIdx++) {
      aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
    }
    return aKeys;
  },
};
export type UserAdaptationCookie = User & { tokenExpiresAt?: number };
export const U3_COOKIE_KEY_TOKEN = 'u3_token';
export const setU3ExtensionCookie = (user: UserAdaptationCookie) => {
  docCookies.setItem(
    U3_COOKIE_KEY_TOKEN,
    user?.token,
    new Date(user?.tokenExpiresAt),
    undefined,
    undefined,
    undefined
  );
};
export const removeU3ExtensionCookie = () => {
  docCookies.removeItem(U3_COOKIE_KEY_TOKEN, undefined, undefined);
};
