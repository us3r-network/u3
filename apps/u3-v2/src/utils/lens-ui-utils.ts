import { Post, Comment } from '@lens-protocol/react-web'
import { SocailPlatform } from '../api'
import { LensPublication } from '../api/lens'

export const lensPublicationToPostCardData = (
  publication: LensPublication | Post | null | undefined,
) => {
  return {
    platform: SocailPlatform.Lens,
    avatar: (publication?.profile?.picture as any)?.original?.url,
    name: publication?.profile?.name || '',
    handle: publication?.profile?.handle || '',
    createdAt: publication?.createdAt || '',
    content: publication?.metadata?.content || '',
    totalLikes: publication?.stats?.totalUpvotes || 0,
    totalReplies: publication?.stats?.totalAmountOfComments || 0,
    totalReposts: publication?.stats?.totalAmountOfMirrors || 0,
    likesAvatar: [],
  }
}

export const lensPublicationToReplyCardData = (
  publication: Comment | null | undefined,
) => {
  return {
    platform: SocailPlatform.Lens,
    avatar: (publication?.profile?.picture as any)?.original?.url,
    name: publication?.profile?.name || '',
    handle: publication?.profile?.handle || '',
    createdAt: publication?.createdAt || '',
    content: publication?.metadata?.content || '',
    totalLikes: publication?.stats?.totalUpvotes || 0,
    totalReplies: publication?.stats?.totalAmountOfComments || 0,
    totalReposts: publication?.stats?.totalAmountOfMirrors || 0,
    likesAvatar: [],
  }
}
