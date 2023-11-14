/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-13 16:00:12
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-13 17:29:43
 * @FilePath: /u3/apps/u3/src/services/news/api/links.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { LinkResponse, LinksListResponse } from '../types/links';
import request, { RequestPromise } from '../../shared/api/request';

export function getLinkCast(
  query: {
    link: string;
    pageSize?: number;
    endCursor?: string;
  },
  token?: string
): RequestPromise<LinkResponse> {
  return request({
    url: `/3r/farcaster/castWithEmbedLinks`,
    method: 'get',
    params: {
      pageSize: query.pageSize ?? 30,
      endCursor: query.endCursor ?? '',
      link: query.link ?? '',
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchLinks(
  query: {
    keywords?: string;
    channels?: string[];
    includeDomains?: string[];
    excludeDomains?: string[];
    orderBy?: string;
    pageSize?: number;
    endCursor?: string;
  },
  token?: string
): RequestPromise<LinksListResponse> {
  return request({
    url: `/3r/farcaster/embedLinks`,
    method: 'get',
    params: {
      pageSize: query.pageSize ?? 30,
      endCursor: query.endCursor ?? '',
      keywords: query.keywords ?? '',
      channel: query.keywords ?? '',
      includeDomain: query.includeDomains ?? [],
      excludeDomain: query.excludeDomains ?? [],
      orderBy: query.orderBy ?? '',
    },
    headers: {
      token,
      needToken: false,
    },
  });
}
