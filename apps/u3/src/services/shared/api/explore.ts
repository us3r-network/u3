import { DappExploreListResponse } from '../../dapp/types/dapp';
import request, { RequestPromise } from './request';
import { LinksListResponse } from '../../news/types/links';
import { getFarcasterTrending } from '../../social/api/farcaster';

export function getHotPosts() {
  // TODO 后期换成包含farcaster和lens的trending
  return getFarcasterTrending({
    start: 0,
    end: 50, // TODO 多取些暂时规避可能取不到6条的问题（fcast 可能被删除）
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
