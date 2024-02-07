import {
  CommunityEntity,
  CommunityStatistics,
  MemberEntity,
} from '../types/community';
import request, { RequestPromise } from '../../shared/api/request';
import { ApiResp } from '@/services/shared/types';

export type FetchCommunityResponse = CommunityEntity & CommunityStatistics;
export function fetchCommunity(
  id: string | number
): RequestPromise<ApiResp<FetchCommunityResponse>> {
  return request({
    url: `/topics/channel?id=${id}`,
    method: 'get',
  });
}

export type CommunityMembersPageInfo = {
  endCursor?: number;
  hasNextPage: boolean;
};
export type CommunityMembersParams = {
  pageSize?: number;
  endCursor?: number;
};
export type CommunityMembersResponse = {
  members: Array<MemberEntity>;
  pageInfo: CommunityMembersPageInfo;
};
export function fetchCommunityMembers(
  id: string | number,
  params: CommunityMembersParams
): RequestPromise<ApiResp<CommunityMembersResponse>> {
  return request({
    url: `/community/${id}/members`,
    method: 'get',
    params,
  });
}

export type CommunityTopMembersResponse = Array<MemberEntity>;
export function fetchCommunityTopMembers(
  id: string | number
): RequestPromise<ApiResp<CommunityTopMembersResponse>> {
  return request({
    url: `/community/${id}/members/top`,
    method: 'get',
  });
}
