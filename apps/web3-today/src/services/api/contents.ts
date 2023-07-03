import {
  ContentLang,
  ContentResponse,
  ContentSaveResponse,
  ContentsListResponse,
  ContentStatus,
  URLParseResponse,
} from '../types/contents';
import request, { RequestPromise } from './request';

export function getContent(
  id: number | string,
  token?: string
): RequestPromise<ContentResponse> {
  return request({
    url: `/contents/${id}`,
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function saveContent(
  data: {
    title: string;
    url: string;
    tags: string[];
    lang: ContentLang;
    uniProjectIds: Array<number>;
    supportReaderView?: boolean;
    supportIframe?: boolean;
    editorScore?: number;
  },
  token: string
): RequestPromise<ContentSaveResponse> {
  return request({
    url: `/contents`,
    method: 'post',
    data: {
      title: data.title,
      url: data.url,
      tags: data.tags,
      lang: data.lang === ContentLang.All ? null : data.lang,
      uniProjectIds: data.uniProjectIds,
      supportReaderView: data.supportReaderView || false,
      supportIframe: data.supportIframe || false,
      editorScore: data.editorScore,
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function updateContent(
  data: {
    id: number;
    title?: string;
    url?: string;
    tags?: string[];
    lang?: ContentLang;
    uniProjectIds?: Array<number>;
    supportReaderView?: boolean;
    supportIframe?: boolean;
    editorScore?: number;
    status?: ContentStatus;
  },
  token: string
) {
  return request({
    url: `/contents/${data.id}`,
    method: 'post',
    data: {
      title: data.title,
      url: data.url,
      tags: data.tags,
      lang: data.lang === ContentLang.All ? undefined : data.lang,
      uniProjectIds: data.uniProjectIds ?? undefined,
      supportReaderView: data.supportReaderView,
      supportIframe: data.supportIframe,
      editorScore: data.editorScore || undefined,
      status: data.status || undefined,
    },
    headers: {
      token,
      needToken: true,
    },
  });
}

export function contentParse(url: string): RequestPromise<URLParseResponse> {
  return request({
    url: `/contents/parser?url=${url}`,
  });
}

export function personalComplete(uuid: string, token: string) {
  return request({
    url: `/contents/${uuid}/personalcompleting`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function complete(id: number, token: string) {
  return request({
    url: `/contents/${id}/completing`,
    method: 'post',
    headers: {
      token,
      needToken: true,
    },
  });
}

export function fetchContents(
  query: {
    keywords?: string;
    tags?: string[];
    orderBy?: string;
    pageSize?: number;
    pageNumber?: number;
    contentId?: string;
    lang?: string;
  },
  token?: string
): RequestPromise<ContentsListResponse> {
  return request({
    url: `/contents/searching`,
    params: {
      lang: query.lang === ContentLang.All ? null : query.lang,
      contentId: query.contentId ?? null,
      pageSize: query.pageSize ?? 30,
      pageNumber: query.pageNumber ?? 0,
      keywords: query.keywords ?? '',
      tags: query.tags ?? [],
      orderBy: query.orderBy ?? '',
    },
    method: 'get',
    headers: {
      token,
      needToken: true,
    },
  });
}
