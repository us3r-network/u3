import axios from 'axios';
import { DappExploreListResponse } from '../../dapp/types/dapp';
import request, { RequestPromise } from './request';
import { REACT_APP_API_SOCIAL_URL } from '../../../constants';
import { LinksListResponse } from '../../news/types/links';

export function getHotPosts() {
  // TODO 后期换成包含farcaster和lens的trending
  return axios({
    url: `${REACT_APP_API_SOCIAL_URL}/3r_farcaster/trending`,
    method: 'get',
    params: {
      startIndex: 0,
      endIndex: 15, // TODO 取15个是因为有些cast可能被删除了
    },
  });
}

export function getTopLinks(): RequestPromise<LinksListResponse> {
  return request({
    url: `/3r/farcaster/embedLinks`,
    params: {
      pageSize: 6,
      orderBy: 'TRENDING',
    },
    method: 'get',
  });
}
export function getHighScoreDapps(): RequestPromise<DappExploreListResponse> {
  return request({
    url: `/dapps/searching`,
    params: {
      pageSize: 8,
      pageNumber: 0,
      keywords: '',
      type: '',
      orderBy: 'TRENDING',
    },
    method: 'get',
  });
}
