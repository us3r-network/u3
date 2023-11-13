import { SocialPlatform } from '../../../../services/social/types';
import getAvatar from '../getAvatar';

export const lensPublicationToPostCardData = (publication: any) => {
  return {
    platform: SocialPlatform.Lens,
    avatar: getAvatar(publication?.profile),
    name: publication?.profile?.name || '',
    handle: publication?.profile?.handle || '',
    createdAt: publication?.createdAt || '',
    content: publication?.metadata?.content || '',
    totalLikes: publication?.stats?.totalUpvotes || 0,
    totalReplies: publication?.stats?.totalAmountOfComments || 0,
    totalReposts: publication?.stats?.totalAmountOfMirrors || 0,
    likeAvatars: [],
  };
};

export const lensPublicationToReplyCardData = (publication: any) => {
  return {
    platform: SocialPlatform.Lens,
    avatar: getAvatar(publication?.profile),
    name: publication?.profile?.name || '',
    handle: publication?.profile?.handle || '',
    createdAt: publication?.createdAt || '',
    content: publication?.metadata?.content || '',
    totalLikes: publication?.stats?.totalUpvotes || 0,
    totalReplies: publication?.stats?.totalAmountOfComments || 0,
    totalReposts: publication?.stats?.totalAmountOfMirrors || 0,
    likeAvatars: [],
  };
};
