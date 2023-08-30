import axios, { AxiosPromise } from 'axios'
import { ApiResp } from '.'
import { API_BASE_URL } from '../constants'

export function getBadges({
  addrs,
}: {
  addrs: string[]
}): AxiosPromise<ApiResp<any>> {
  return axios({
    url: API_BASE_URL + `/users/assets`,
    method: 'get',
    params: {
      wallet: addrs,
      asset: ['poap', 'noox', 'galxe'],
    },
  })
}
