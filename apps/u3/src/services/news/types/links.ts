/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-12 18:42:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-20 17:02:49
 * @Description: file description
 */
import { FarCastEmbedMeta } from 'src/services/social/types';
import { ApiResp } from '../../shared/types';
import { URLParseData } from './contents';

export type LinkListItem = {
  url: string;
  casts_hash: string[];
  timestamp: string;
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
