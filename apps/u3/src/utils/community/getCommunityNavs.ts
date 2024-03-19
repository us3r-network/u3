import {
  getCommunityAppPath,
  getCommunityLinksPath,
  getCommunityNftPath,
  getCommunityPointPath,
  getCommunityPostsPath,
  getCommunityTokenPath,
} from '@/route/path';
import { CommunityInfo } from '@/services/community/types/community';

export default function getCommunityNavs(
  channelId: string,
  communityInfo: CommunityInfo
) {
  const { nfts, tokens, points, apps } = communityInfo || {};
  const mainNavs = [
    { title: 'Posts', href: getCommunityPostsPath(channelId) },
    { title: 'Links', href: getCommunityLinksPath(channelId) },
    // { title: 'Members', href: `/community/${channelId}/members` },
  ];
  const nft = nfts?.length > 0 ? nfts[0] : null;
  if (nft) {
    mainNavs.push({
      title: 'NFT',
      href: getCommunityNftPath(channelId, nft?.contract),
    });
  }

  const token = tokens?.length > 0 ? tokens[0] : null;
  if (token) {
    mainNavs.push({
      title: 'Token',
      href: getCommunityTokenPath(channelId, token?.contract),
    });
  }

  const point = points?.length > 0 ? points[0] : null;
  if (point) {
    mainNavs.push({
      title: 'Points',
      href: getCommunityPointPath(channelId),
    });
  }

  const dappNavs = apps?.map((dapp) => {
    return {
      title: dapp.name,
      href: getCommunityAppPath(channelId, dapp.name),
      icon: dapp.logo,
    };
  });

  return {
    mainNavs,
    dappNavs,
  };
}
