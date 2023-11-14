/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-12 18:42:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 11:38:41
 * @Description: file description
 */
import { FarcasterPageInfo } from 'src/services/social/api/farcaster';
import { ApiResp } from '../../shared/types';

export type LinkListItem = {
  url: string;
  casts_hash: string[];
  timestamp: string;
  supportReaderView?: boolean;
  supportIframe?: boolean;
  title?: string;
  value?: string;
  tags?: string[];
};

export type LinksListResponse = ApiResp<{
  data: LinkListItem[];
  pageInfo: FarcasterPageInfo;
}>;

export type LinkResponse = ApiResp<LinkListItem>;
