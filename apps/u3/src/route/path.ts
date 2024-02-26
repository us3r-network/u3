import { isMobile } from 'react-device-detect';

export const getCommunityPath = (communityId: string) =>
  isMobile ? `/social/channel/${communityId}` : `/community/${communityId}`;

export const getCommunityPostsPath = (communityId: string) =>
  `/community/${communityId}/posts`;

export const getCommunityNftPath = (communityId: string, contract: string) =>
  `/community/${communityId}/nft/${contract}`;

export const getCommunityTokenPath = (communityId: string, contract: string) =>
  `/community/${communityId}/token/${contract}`;

export const getCommunityPointPath = (communityId: string) =>
  `/community/${communityId}/point`;

export const getCommunityAppPath = (communityId: string, appName: string) =>
  `/community/${communityId}/app/${appName}`;

export const getCommunityFcPostDetailPath = (
  communityId: string,
  postId: string | number
) => `/community/${communityId}/posts/fc/${postId}`;
