/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-13 16:00:12
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-05 11:24:40
 * @FilePath: /u3/apps/u3/src/services/news/api/links.ts
 * @Description:
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
    url: `/3r-farcaster/castWithEmbedLinks`,
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
    keywords?: string[];
    includeDomains?: string[];
    excludeDomains?: string[];
    rootParentUrls?: string[];
    orderBy?: string;
    urls?: string[];
    pageSize?: number;
    endCursor?: string;
  },
  token?: string
): RequestPromise<LinksListResponse> {
  return request({
    url: `/3r-farcaster/embedLinks`,
    method: 'get',
    params: {
      pageSize: query.pageSize ?? 30,
      endCursor: query.endCursor ?? '',
      keywords: query.keywords ?? '',
      includeDomains: query.includeDomains ?? [],
      excludeDomains: query.excludeDomains ?? [],
      rootParentUrls: query.rootParentUrls ?? [],
      orderBy: query.orderBy ?? '',
      urls: query.urls ?? [],
    },
    headers: {
      token,
      needToken: false,
    },
  });
}
