/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 10:28:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 17:29:09
 * @Description: file description
 */
import type { ApiResp } from '.';
import type { OrderBy } from './common';
import { ContentListItem } from './contents';
import type { DappExploreListItemResponse } from './dapp';
import type { EventExploreListItemResponse } from './event';

export enum UniprojectStatus {
  HIDDEN = 'HIDDEN',
  VISIBLE = 'VISIBLE',
  VERIFIED = 'VERIFIED',
}

export type ProjectEntity = {
  id: number;
  name: string;
  description: string;
  image: string;
};
export type ProjectExploreListParams = {
  keywords?: string;
  orderBy?: OrderBy | '';
  type?: string;
  types?: string[];
  chains?: string[];
  pageSize?: number;
  pageNumber?: number;
  projectId?: number;
};

export type ProjectExploreListItemResponse = {
  id: number;
  name: string;
  description: string;
  image: string;
  favored?: boolean;
  events?: EventExploreListItemResponse[];
  contents?: ContentListItem[];
  dapps?: DappExploreListItemResponse[];
  url: string;
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  chains?: string[];
  status?: UniprojectStatus;
};
export type ProjectExploreListResponse = ApiResp<
  Array<ProjectExploreListItemResponse>
>;
export type ProjectFavoriteListItemResponse = ProjectExploreListItemResponse;
export type ProjectFavoriteListResponse = ApiResp<
  Array<ProjectFavoriteListItemResponse>
>;
export type ProjectFavorHandleResponse = ApiResp<unknown>;
export type FetchOneProjectResponse = ApiResp<ProjectExploreListItemResponse>;

export type UpdateProjectData = {
  name: string;
  description: string;
  image: string;
  mediaLinks?: {
    twitter?: string;
    discord?: string;
    facebook?: string;
    telegram?: string;
  };
  types?: string[];
  url: string;
  chains?: string[];
  status?: UniprojectStatus;
  editorScore?: number;
};
export type UpdateProjectResponse = ApiResp<ProjectExploreListItemResponse>;
