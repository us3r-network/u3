// explore
export const getExploreFcPostDetailPath = (postId: string | number) =>
  `/social/post-detail/fcast/${postId}`;

export const getExploreLensPostDetailPath = (postId: string | number) =>
  `/social/post-detail/lens/${postId}`;

// community
export const getCommunityPath = (communityId: string) =>
  `/community/${communityId}`;
export const isCommunityPath = (path: string) => path.includes('/community/');

export const getCommunityPostsPath = (communityId: string) =>
  `/community/${communityId}/posts`;
export const getCommunityLinksPath = (communityId: string) =>
  `/community/${communityId}/links`;
export const isCommunityLinksPath = (path: string) => {
  const p = path.split('/');
  return p[1] === 'community' && p[3] === 'links';
};

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
