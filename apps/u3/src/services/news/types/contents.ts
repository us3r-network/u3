/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-12 18:42:59
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:43:03
 * @Description: file description
 */
import { ApiResp } from '../../shared/types';

export enum ContentLang {
  All = 'All', // only for UI
  English = 'EN',
  中文 = 'CN',
}

export enum ContentLangRev {
  EN = 'English',
  CN = '中文',
}

export enum ContentStatus {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
}

export enum ContentType {
  NEWS = 'News',
  GAMING = 'Gaming',
  DEFI = 'Defi',
  NFTS = 'Nfts',
  READS = 'Reads',
  POADCAST_NOTES = 'Poadcast notes',
  ANNOUNCEMENT = 'Announcement',
}

export enum OrderBy {
  // EARLIEST = 'Earliest',
  FORU = 'For U',
  TRENDING = 'Trending',
  NEWEST = 'Newest',
  // MEMPOOL = 'Mem Pool',
}

export type ContentListItem = {
  uid?: string;
  // action?: { linkUrl: string };
  imageUrl?: string;
  uniProjects?: Array<{
    description: string;
    favored: boolean;
    id: number;
    image: string;
    name: string;
  }>;
  uuid?: string;
  id: number;
  title: string;
  createdAt: number;
  value: string;
  author: string;
  description: string;
  chain: 'ETH';
  link: string;
  upVoteNum: number;
  type: string;
  tags: string[];
  platform: {
    logo: string;
  };
  supportReaderView?: boolean;
  supportIframe?: boolean;
  upVoted: boolean;
  favored: boolean;
  hidden: boolean;
  uniProject: {
    id: 1;
    description: string;
    name: string;
    image: string;
  };
  isForU?: boolean;
  editorScore: null | number;
  favorNum?: number;
  linkStreamId?: string;
};

export type ContentsListResponse = ApiResp<Array<ContentListItem>>;

export type URLParseResponse = ApiResp<{
  title: string;
  content: string;
  // byline: null;
  // dir: null;
  excerpt: string;
  lang: string;
  length: number;
  // siteName: null;
  textContent: string;
}>;

export type Project = {
  favored: boolean;
  id: number;
  image: string;
  name: string;
};
export type ContentsResponse = ApiResp<Array<Project>>;
export type ContentSaveResponse = ApiResp<ContentListItem>;
export type ContentResponse = ApiResp<ContentListItem>;

export type ContentLinkData = {
  title: string;
  author?: string;
  value?: string;
  description: string;
  platform?: {
    logo?: string;
  };
  chain: string;
  createdAt: number;

  supportReaderView: boolean;
  supportIframe: boolean;

  tags: string[];
};
