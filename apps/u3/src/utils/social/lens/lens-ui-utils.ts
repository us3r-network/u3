/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Comment } from '@lens-protocol/react-web';
import { SocialPlatform } from '../../../services/social/types';
import { LensPost } from '../../../services/social/api/lens';
import getAvatar from './getAvatar';
import getContent from './getContent';
import { getHandle, getName } from './profile';

export const lensPublicationToPostCardData = (
  publication: LensPost | null | undefined
) => {
  return {
    platform: SocialPlatform.Lens,
    avatar: getAvatar(publication?.by),
    name: getName(publication?.by),
    handle: getHandle(publication?.by),
    createdAt: publication?.createdAt || '',
    content: getContent(publication?.metadata),
    totalLikes: publication?.stats?.upvotes || 0,
    totalReplies: publication?.stats?.comments || 0,
    totalReposts: publication?.stats?.mirrors || 0,
    likeAvatars: [],
  };
};

export const lensPublicationToReplyCardData = (
  publication: Comment | null | undefined
) => {
  return {
    platform: SocialPlatform.Lens,
    avatar: getAvatar(publication?.by),
    name: getName(publication?.by),
    handle: getHandle(publication?.by),
    createdAt: publication?.createdAt || '',
    content: getContent(publication?.metadata),
    totalLikes: publication?.stats?.upvotes || 0,
    totalReplies: publication?.stats?.comments || 0,
    totalReposts: publication?.stats?.mirrors || 0,
    likeAvatars: [],
  };
};
