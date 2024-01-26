import { removeDefaultFarcaster } from '../social/farcaster/farcaster-default';
import {
  removeFarsignPrivateKey,
  removeFarsignSigner,
} from '../social/farcaster/farsign-utils';

/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-30 18:47:46
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 18:56:49
 * @Description: file description
 */
const HOME_BANNER_HIDDEN = 'HOME_BANNER_HIDDEN';
export function getHomeBannerHiddenForStore(): number {
  return Number(localStorage.getItem(HOME_BANNER_HIDDEN));
}

export function setHomeBannerHiddenToStore() {
  localStorage.setItem(HOME_BANNER_HIDDEN, '1');
}
export function removeHomeBannerHiddenFromStore() {
  localStorage.removeItem(HOME_BANNER_HIDDEN);
}

export function verifyHomeBannerHiddenByStore(): boolean {
  return getHomeBannerHiddenForStore() === 1;
}

export function removeFarcasterInfoFromStore() {
  removeFarsignPrivateKey();
  removeFarsignSigner();
  removeDefaultFarcaster();
}
