/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 10:25:12
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 10:56:24
 * @Description: file description
 */
import { ApiResp } from '../../shared/types';
import {
  ChainType,
  OrderBy,
  Platform,
  Reward,
} from '../../shared/types/common';

export enum EventStatus {
  PERSONAL = 'PERSONAL',
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
}
export type EventEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
  link: string;
  chain: ChainType;
  startTime: number;
  endTime: number;
  reward: Reward;
};
export type EventExploreListParams = {
  keywords?: string;
  platforms?: string;
  rewards?: string;
  eventTypes?: string;
  projectTypes?: string;
  orderBy?: OrderBy;
  pageSize?: number;
  pageNumber?: number;
  eventId?: number;
  uuid?: string;
};

export type EventExploreListItemResponse = {
  uid?: string;
  id: number | string;
  name: string;
  description: string;
  image: string;
  link: string;
  chain: ChainType;
  startTime: number;
  endTime: number;
  reward: Reward;
  project?: {
    id: number;
    name: string;
    description: string;
    image: string;
  };
  platform?: {
    name: string;
    logo: string;
  };
  supportIframe: boolean;
  uuid?: string;
  isForU?: boolean;
  editorScore?: number;
  types: string[];
  recReason?: string;
  linkStreamId?: string;
};
export type FetchOneEventResponse = ApiResp<EventExploreListItemResponse>;
export type EventExploreListResponse = ApiResp<
  Array<EventExploreListItemResponse>
>;
export type EventFavorHandleResponse = ApiResp<unknown>;
export type EventCompleteHandleResponse = ApiResp<unknown>;

export type CreateEventData = {
  name: string;
  description: string;
  image: string;
  platform: Platform;
  project: number;
  link: string;
  chain: ChainType;
  reward: Reward;
  startTime: number;
  endTime: number;
  supportIframe: boolean;
  status?: EventStatus;
  editorScore?: number;
  types: string[];
};
export type CreateEventResponse = ApiResp<EventExploreListItemResponse>;

export type EventLinkData = {
  name?: string;
  description?: string;
  image?: string;
  platform?: {
    name?: string;
    logo?: string;
  };
  chain?: ChainType;
  reward?: Reward;

  startTime?: number;
  endTime?: number;

  supportIframe?: boolean;
  types?: string[];
};
