/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 09:39:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 17:27:12
 * @Description: file description
 */
import { useCallback } from 'react';
import { EventExploreListItemResponse } from '../../services/news/types/event';
import { tweetShare } from '../../utils/shared/twitter';
import { getEventShareUrl } from '../../utils/shared/share';
import { useGAEvent } from '../shared/useGoogleAnalytics';

export default () => {
  const gaEvent = useGAEvent('u3-event');

  const onShare = useCallback(
    (item: EventExploreListItemResponse) => {
      gaEvent('shareEvent', item.name);
      tweetShare(item.name, getEventShareUrl(item.id));
    },
    [gaEvent]
  );
  return {
    onShare,
  };
};
