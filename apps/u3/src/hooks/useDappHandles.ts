/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:54:35
 * @Description: file description
 */
import { useCallback } from 'react';
import { DappExploreListItemResponse } from '../services/types/dapp';
import { tweetShare } from '../utils/twitter';
import { getDappShareUrl } from '../utils/share';

export default () => {
  const onShare = useCallback((item: DappExploreListItemResponse) => {
    tweetShare(item.name, getDappShareUrl(item.id));
  }, []);
  return {
    onShare,
  };
};
