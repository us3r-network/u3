import { DappLinkData } from '../../services/dapp/types/dapp';

/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-16 13:52:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-16 16:04:34
 * @Description: file description
 */
const DAPP_SIDEBAR_ORDER_STORAGE_KEY = 'DAPP_SIDEBAR_ORDER';
export function getDappSideBarOrderForStore(): string[] {
  try {
    const value = localStorage.getItem(DAPP_SIDEBAR_ORDER_STORAGE_KEY) || '[]';
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
}

export function setDappSideBarOrderToStore(ids: string[]) {
  localStorage.setItem(DAPP_SIDEBAR_ORDER_STORAGE_KEY, JSON.stringify(ids));
}

export const getDappLinkDataWithJsonValue = (
  value: string
): DappLinkData | null => {
  if (!value) return null;
  try {
    const data = JSON.parse(value);
    return data;
  } catch (error) {
    return null;
  }
};
