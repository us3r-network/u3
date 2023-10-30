/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 17:29:00
 * @Description: file description
 */
import type { ApiResp } from '../../shared/types';
import type { OrderBy } from '../../shared/types/common';
import { ProjectExploreListItemResponse } from '../../shared/types/project';

export enum DappStatus {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
  VERIFIED = 'VERIFIED',
}

export type DappEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
};
export type DappExploreListParams = {
  keywords?: string;
  orderBy?: OrderBy | '';
  type?: string;
  types?: string[];
  chains?: string[];
  pageSize?: number;
  pageNumber?: number;
  projectId?: number;
};

export type DappExploreListItemResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  headerPhoto: string;
  screenshots: string[];
  url: string;
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  chains?: string[];
  status?: DappStatus;
  project?: ProjectExploreListItemResponse;
  linkStreamId?: string;
  tokenId?: number;
  supportIframe: boolean;
};
export type DappExploreListResponse = ApiResp<
  Array<DappExploreListItemResponse>
>;
export type DappFavoriteListItemResponse = DappExploreListItemResponse;
export type DappFavoriteListResponse = ApiResp<
  Array<DappFavoriteListItemResponse>
>;
export type DappFavorHandleResponse = ApiResp<unknown>;
export type FetchOneDappResponse = ApiResp<DappExploreListItemResponse>;

export type UpdateDappData = {
  name: string;
  description: string;
  image: string;
  headerPhoto: string;
  screenshots: string[];
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  url: string;
  chains?: string[];
  status?: DappStatus;
  editorScore?: number;
  uniProjectId: number;
  supportIframe: boolean;
};
export type UpdateDappResponse = ApiResp<DappExploreListItemResponse>;

export type DappLinkData = {
  name?: string;
  description?: string;
  image?: string;
  chains?: string[];
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  tags?: string[];
  status?: DappStatus;
  screenshots?: string[];
  supportIframe?: boolean;
  headerPhoto?: string;
};
