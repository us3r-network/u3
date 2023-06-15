/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 17:20:10
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-05 18:19:27
 * @Description: file description
 */
import { EventLinkData } from '../services/types/event';

const EVENT_COMPLETE_GUIDE_KEY = 'EVENT_COMPLETE_GUIDE';
export function getEventCompleteGuideForStore(): number {
  return Number(localStorage.getItem(EVENT_COMPLETE_GUIDE_KEY));
}

export function setEventCompleteGuideEndToStore() {
  localStorage.setItem(EVENT_COMPLETE_GUIDE_KEY, '1');
}

export function verifyEventCompleteGuideEndByStore(): boolean {
  return getEventCompleteGuideForStore() === 1;
}

export const NO_ENDTIME_TIMESTRAMP = 4102416000 * 1000;
export const EVENT_ADMIN_PLUS_SCORE_STEP = 10;

export const getEventLinkDataWithJsonValue = (
  value: string
): EventLinkData | null => {
  if (!value) return null;
  try {
    const data = JSON.parse(value);
    return data;
  } catch (error) {
    return null;
  }
};
