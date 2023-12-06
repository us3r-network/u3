/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-12 18:42:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 15:10:29
 * @Description: file description
 */
import { FarCastEmbedMeta } from 'src/services/social/types';
import { ApiResp } from '../../shared/types';
import { URLParseData } from './contents';

export type LinkListItem = {
  score: number;
  url: string;
  casts_hash: string[];
  timestamp: string;
  total_like_num: number;
  total_reply_num: number;
  total_repost_num: number;
  supportReaderView?: boolean;
  supportIframe?: boolean;
  metadata?: FarCastEmbedMeta;
  readerView?: URLParseData;
  tags?: string[];
};

export type PageInfo = {
  endFarcasterCursor: string;
  hasNextPage: boolean;
};

export type LinksListResponse = ApiResp<{
  data: LinkListItem[];
  pageInfo: PageInfo;
}>;

export type LinkResponse = ApiResp<LinkListItem>;
