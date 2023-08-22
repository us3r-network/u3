import axios, { AxiosPromise } from 'axios'
import { ApiResp, FarCast } from '.'
import { API_BASE_URL } from '../constants'

console.log({ API_BASE_URL })

export function getFarcasterFeeds({
  endFarcasterCursor,
  pageSize,
}: {
  endFarcasterCursor?: string
  pageSize?: number
}): AxiosPromise<
  ApiResp<{
    data: { data: FarCast; platform: 'farcaster' }[]
    farcasterUserData: { fid: string; type: number; value: string }[]
    pageInfo: {
      endFarcasterCursor: string
      hasNextPage: boolean
    }
  }>
> {
  return axios({
    url: API_BASE_URL + `/3r/farcasts`,
    method: 'get',
    params: {
      endFarcasterCursor,
      pageSize,
    },
  })
}
