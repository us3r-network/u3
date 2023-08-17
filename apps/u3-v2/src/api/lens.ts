import axios, { AxiosPromise } from 'axios'
import { API_BASE_URL } from '../constants'
import { ApiResp } from '.'

export type LensFeedPost = {
  id: string
  appId: string
  timestamp: number
  profile: {
    id: string
    name: string
    handle: string
    ownedBy: string
    picture: {
      original: {
        url: string
      }
    }
  }
  metadata: {
    name: string
    content: string
    image: string
    tags: string[]
    attributes: Array<{
      traitType: string
      value: string
    }>
    cover: string
    media: Array<any>
    encryptionParams: string
  }
  stats: {
    totalUpvotes: number
    totalAmountOfMirrors: number
    totalAmountOfCollects: number
    totalBookmarks: number
    totalAmountOfComments: number
    commentsTotal: number
  }
}

export const getFeeds = async (opts?: {
  pageSize?: number
  endLensCursor?: string
}): AxiosPromise<
  ApiResp<{
    data: { data: LensFeedPost; platform: 'lens' }[]
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
    },
  })
}
