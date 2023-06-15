/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 14:05:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:40:30
 * @Description: file description
 */
import { ApiResp } from '.';

export enum ChainType {
  EVM = 'EVM',
  SOLANA = 'SOLANA',
  BSC = 'BSC',
  MATIC = 'MATIC',
  APTOS = 'APTOS',
}

export enum OrderBy {
  EARLIEST = 'EARLIEST',
  TRENDING = 'TRENDING',
  NEWEST = 'NEWEST',
  FORU = 'FORU',
}

export enum Platform {
  GALXE = 'GALXE',
  NOOX = 'NOOX',
  POAP = 'POAP',
  QUEST3 = 'QUEST3',
  RABBIT_HOLE = 'RABBIT_HOLE',
  LINK3 = 'LINK3',
}

export enum Reward {
  BADGE = 'BADGE',
  NFT = 'NFT',
  TOKEN = 'TOKEN',
  WL = 'WL',
}

export enum TagType {
  SOCIAL = 'social',
  TRANSACTION = 'transaction',
  EXCHANGE = 'exchange',
  COLLECTIBLE = 'collectible',
  DONATION = 'donation',
  GOVERNANCE = 'governance',
}

export enum PlatformLogo {
  GALXE = 'https://galxe.com/favicon.ico',
  NOOX = 'https://noox.world/favicon.ico',
  POAP = 'https://poap.xyz/favicon-32x32.dba5403f.png',
  QUEST3 = 'https://quest3.xyz/favicon.ico',
}

export enum PlatformType {
  EVENT = 'EVENT',
  CONTENT = 'CONTENT',
}
export type PlatformsItemResponse = {
  platform: string;
  platformLogo: string;
  platformUrl: string;
  number: number;
  type: PlatformType;
};
export type PlatformsResponse = ApiResp<Array<PlatformsItemResponse>>;

export type ConfigTopicsChain = {
  chainEnum: string;
  image: string;
  link: string;
  name: string;
};
export type ConfigTopicsType = {
  name: string;
  num: number;
  image?: string;
};
export type ConfigTopics = {
  eventRewards: ConfigTopicsType[];
  eventTypes: ConfigTopicsType[];
  projectTypes: string[];
  dappTypes: ConfigTopicsType[];
  contentTypes: string[];
  langs: string[];
  chains: ConfigTopicsChain[];
  contentTags: ConfigTopicsType[];
};
export type ConfigTopicsResponse = ApiResp<ConfigTopics>;
