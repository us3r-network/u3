import axios, { AxiosPromise } from 'axios'
import { API_BASE_URL } from '../constants'
import { ApiResp } from '.'
import { ReactionTypes } from '@lens-protocol/react-web'

/** The reason why a profile cannot decrypt a publication */
export enum DecryptFailReason {
  CanNotDecrypt = 'CAN_NOT_DECRYPT',
  CollectNotFinalisedOnChain = 'COLLECT_NOT_FINALISED_ON_CHAIN',
  DoesNotFollowProfile = 'DOES_NOT_FOLLOW_PROFILE',
  DoesNotOwnNft = 'DOES_NOT_OWN_NFT',
  DoesNotOwnProfile = 'DOES_NOT_OWN_PROFILE',
  FollowNotFinalisedOnChain = 'FOLLOW_NOT_FINALISED_ON_CHAIN',
  HasNotCollectedPublication = 'HAS_NOT_COLLECTED_PUBLICATION',
  MissingEncryptionParams = 'MISSING_ENCRYPTION_PARAMS',
  ProfileDoesNotExist = 'PROFILE_DOES_NOT_EXIST',
  UnauthorizedAddress = 'UNAUTHORIZED_ADDRESS',
  UnauthorizedBalance = 'UNAUTHORIZED_BALANCE',
}

export type LensPublication = {
  timestamp?: number

  __typename?: 'Post'
  id: any
  reaction?: ReactionTypes | null
  mirrors: Array<any>
  bookmarked: boolean
  notInterested: boolean
  hasCollectedByMe: boolean
  onChainContentURI: string
  isGated: boolean
  isDataAvailability: boolean
  dataAvailabilityProofs?: string | null
  hidden: boolean
  createdAt: any
  appId?: any | null
  metadata: {
    __typename?: 'MetadataOutput'
    name?: string | null
    content?: any | null
    image?: any | null
    tags: Array<string>
    attributes: Array<{
      __typename?: 'MetadataAttributeOutput'
      traitType?: string | null
      value?: string | null
    }>
    cover?: {
      __typename?: 'MediaSet'
      original: { __typename?: 'Media'; url: any }
    } | null
    media: Array<{
      __typename?: 'MediaSet'
      original: { __typename?: 'Media'; url: any; mimeType?: any | null }
    }>
  }
  profile: {
    __typename?: 'Profile'
    id: any
    name?: string | null
    handle: any
    bio?: string | null
    ownedBy: any
    isFollowedByMe: boolean
    picture?:
      | {
          __typename?: 'MediaSet'
          original: { __typename?: 'Media'; url: any }
        }
      | {
          __typename?: 'NftImage'
          uri: any
          tokenId: string
          contractAddress: any
          chainId: number
        }
      | null
    coverPicture?:
      | {
          __typename?: 'MediaSet'
          original: { __typename?: 'Media'; url: any }
        }
      | { __typename?: 'NftImage' }
      | null
    followModule?:
      | { __typename: 'FeeFollowModuleSettings' }
      | { __typename: 'ProfileFollowModuleSettings' }
      | { __typename: 'RevertFollowModuleSettings' }
      | { __typename: 'UnknownFollowModuleSettings' }
      | null
  }
  canComment: { __typename?: 'CanCommentResponse'; result: boolean }
  canMirror: { __typename?: 'CanMirrorResponse'; result: boolean }
  canDecrypt: {
    __typename?: 'CanDecryptResponse'
    result: boolean
    reasons?: Array<DecryptFailReason> | null
  }
  stats: {
    __typename?: 'PublicationStats'
    totalUpvotes: number
    totalAmountOfMirrors: number
    totalAmountOfCollects: number
    totalBookmarks: number
    totalAmountOfComments: number
    commentsTotal: number
  }
}

export const getLensFeeds = async (opts?: {
  pageSize?: number
  endLensCursor?: string
  activeLensProfileId?: string
  keyword?: string
}): AxiosPromise<
  ApiResp<{
    data: { data: LensPublication; platform: 'lens' }[]
    pageInfo: {
      endLensCursor: string
      hasNextPage: boolean
    }
  }>
> => {
  return await axios.request({
    url: API_BASE_URL + '/3r/lens/feeds',
    method: 'GET',
    params: {
      pageSize: opts?.pageSize ?? 10,
      endLensCursor: opts?.endLensCursor ?? '',
      activeLensProfileId: opts?.activeLensProfileId ?? '',
      keyword: opts?.keyword ?? '',
    },
  })
}
