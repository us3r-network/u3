import axios, { AxiosPromise } from 'axios'
import { API_BASE_URL } from '../constants'
import { LensPublication } from './lens'
import { ApiResp, FarCast, SocailPlatform } from '.'

export type FeedsDataItem =
  | { data: FarCast; platform: SocailPlatform.Farcaster }
  | { data: LensPublication; platform: SocailPlatform.Lens }

export type FeedsPageInfo = {
  endLensCursor: string
  endFarcasterCursor: string
  hasNextPage: boolean
}

export function getFeeds({
  pageSize,
  keyword,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
}: {
  pageSize?: number
  keyword?: string
  endFarcasterCursor?: string
  endLensCursor?: string
  activeLensProfileId?: string
}): AxiosPromise<
  ApiResp<{
    data: FeedsDataItem[]
    farcasterUserData: { fid: string; type: number; value: string }[]
    pageInfo: FeedsPageInfo
  }>
> {
  return axios({
    url: API_BASE_URL + `/3r/feeds`,
    method: 'get',
    params: {
      pageSize,
      keyword,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
    },
  })
}

export function getFollowingFeeds({
  pageSize,
  keyword,
  endFarcasterCursor,
  endLensCursor,
  activeLensProfileId,
  address,
  fid,
}: {
  pageSize?: number
  keyword?: string
  endFarcasterCursor?: string
  endLensCursor?: string
  activeLensProfileId?: string
  address?: string
  fid?: string
}): AxiosPromise<
  ApiResp<{
    data: FeedsDataItem[]
    farcasterUserData: { fid: string; type: number; value: string }[]
    pageInfo: FeedsPageInfo
  }>
> {
  return axios({
    url: API_BASE_URL + `/3r/followingFeeds`,
    method: 'get',
    params: {
      pageSize,
      keyword,
      endFarcasterCursor,
      endLensCursor,
      activeLensProfileId,
      address,
      fid,
    },
  })
}
