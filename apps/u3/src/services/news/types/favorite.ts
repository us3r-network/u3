/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 14:23:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 14:32:00
 * @Description: file description
 */
import { ApiResp } from '../../shared/types';
import { ContentListItem } from './contents';
import { EventExploreListItemResponse } from './event';
import { ProjectExploreListItemResponse } from '../../shared/types/project';
import { DappExploreListItemResponse } from '../../dapp/types/dapp';

export type EventFavoriteListItemResponse = EventExploreListItemResponse;
export type ProjectFavoriteListItemResponse = ProjectExploreListItemResponse;
export type DappFavoriteListItemResponse = DappExploreListItemResponse;
export type ContentFavoriteListItemResponse = ContentListItem;
export type UserGroupFavorites = {
  events: Array<EventExploreListItemResponse>;
  projects: Array<ProjectFavoriteListItemResponse>;
  dapps: Array<DappFavoriteListItemResponse>;
  contents: Array<ContentFavoriteListItemResponse>;
};
export type UserGroupFavoritesResponse = ApiResp<UserGroupFavorites>;
