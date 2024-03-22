import {
  CommunityEntity,
  CommunityStatistics,
  CommunityTypeEntity,
  MemberEntity,
} from "../types/community";
import request, { RequestPromise } from "../../shared/api/request";
import { ApiResp } from "~/services/shared/types";

export type CommunityTypesData = Array<CommunityTypeEntity>;
export function fetchCommunityTypes(): RequestPromise<
  ApiResp<CommunityTypesData>
> {
  return request({
    url: `/topics/community-types`,
    method: "get",
  });
}

export type TrendingCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type TrendingCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchTrendingCommunities(
  params: TrendingCommunitiesParams
): RequestPromise<ApiResp<TrendingCommunitiesData>> {
  return request({
    url: `/topics/trending`,
    method: "get",
    params,
  });
}

export type NewestCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type NewestCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchNewestCommunities(
  params: NewestCommunitiesParams
): RequestPromise<ApiResp<NewestCommunitiesData>> {
  return request({
    url: `/topics/newest`,
    method: "get",
    params,
  });
}

export type JoinedCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type JoinedCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchJoinedCommunities(
  params: JoinedCommunitiesParams
): RequestPromise<ApiResp<JoinedCommunitiesData>> {
  return request({
    url: `/topics/joined`,
    method: "get",
    params,
    headers: {
      needToken: true,
    },
  });
}

export type GrowingCommunitiesParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type GrowingCommunitiesData = Array<
  CommunityEntity & CommunityStatistics
>;
export function fetchGrowingCommunities(
  params: GrowingCommunitiesParams
): RequestPromise<ApiResp<GrowingCommunitiesData>> {
  return request({
    url: `/topics/trending`,
    method: "get",
    params,
  });
}

export type JoiningCommunityData = null;
export function fetchJoiningCommunity(
  topicId: string | number
): RequestPromise<ApiResp<JoiningCommunityData>> {
  return request({
    url: `/topics/${topicId}/joining`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}

export type UnjoiningCommunityData = null;
export function fetchUnjoiningCommunity(
  topicId: string | number
): RequestPromise<ApiResp<UnjoiningCommunityData>> {
  return request({
    url: `/topics/${topicId}/unjoining`,
    method: "post",
    headers: {
      needToken: true,
    },
  });
}

export type CommunityData = CommunityEntity & CommunityStatistics;
export function fetchCommunity(
  id: string | number
): RequestPromise<ApiResp<CommunityData>> {
  return request({
    url: `/topics/channel?id=${id}`,
    method: "get",
    headers: {
      needToken: true,
    },
  });
}

export type CommunityMembersParams = {
  pageSize?: number;
  pageNumber?: number;
  type?: string;
};
export type CommunityMembersData = {
  members: Array<MemberEntity>;
  totalNum: number;
};
export function fetchCommunityMembers(
  id: string | number,
  params: CommunityMembersParams
): RequestPromise<ApiResp<CommunityMembersData>> {
  return request({
    url: `/topics/${id}/members`,
    method: "get",
    params,
  });
}

export type CommunityTopMembersResponse = Array<MemberEntity>;
export function fetchCommunityTopMembers(
  id: string | number
): RequestPromise<ApiResp<CommunityTopMembersResponse>> {
  return request({
    url: `/topics/${id}/members/top`,
    method: "get",
  });
}
