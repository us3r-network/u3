/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Post, Comment } from '@lens-protocol/react-web';
import { SocialPlatform } from '../../../services/social/types';
import getAvatar from './getAvatar';
import getContent from './getContent';
import { getHandle, getName } from './profile';
import { getComments, getMirrors, getUpvotes } from './publication';

export const lensPublicationToPostCardData = (
  publication: Post | null | undefined
) => {
  return {
    platform: SocialPlatform.Lens,
    avatar: getAvatar(publication?.by),
    name: getName(publication?.by) || publication?.by?.id,
    handle: getHandle(publication?.by) || publication?.by?.id,
    createdAt: publication?.createdAt || '',
    content: getContent(publication?.metadata),
    totalLikes: getUpvotes(publication),
    totalReplies: getComments(publication),
    totalReposts: getMirrors(publication),
    likeAvatars: [],
  };
};

export const lensPublicationToReplyCardData = (
  publication: Comment | null | undefined
) => {
  return {
    platform: SocialPlatform.Lens,
    avatar: getAvatar(publication?.by),
    name: getName(publication?.by) || publication?.by?.id,
    handle: getHandle(publication?.by) || publication?.by?.id,
    createdAt: publication?.createdAt || '',
    content: getContent(publication?.metadata),
    totalLikes: getUpvotes(publication),
    totalReplies: getComments(publication),
    totalReposts: getMirrors(publication),
    likeAvatars: [],
  };
};
