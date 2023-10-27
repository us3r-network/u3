/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 14:11:54
 * @Description: file description
 */
import { useCallback } from 'react';
import { ProjectExploreListItemResponse } from '../../services/shared/types/project';
import { tweetShare } from '../../utils/shared/twitter';
import { getProjectShareUrl } from '../../utils/shared/share';

export default () => {
  const onShare = useCallback((item: ProjectExploreListItemResponse) => {
    tweetShare(item.name, getProjectShareUrl(item.id));
  }, []);
  return {
    onShare,
  };
};
