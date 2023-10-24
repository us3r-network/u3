/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-09-05 15:28:30
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-24 10:23:30
 * @FilePath: /u3/apps/u3/src/hooks/usePersonalFavorsLinkData.ts
 * @Description: personal favors contents and events
 *  */
import { usePersonalFavors } from '@us3r-network/link';
import { useMemo } from 'react';
import { getContentLinkDataWithJsonValue } from '../utils/content';
import { getEventLinkDataWithJsonValue } from '../utils/event';

export default () => {
  const { isFetching, personalFavors } = usePersonalFavors();

  const personalContents = useMemo(
    () =>
      personalFavors
        .filter((item) => item?.link?.type === 'content')
        .map((item) => {
          const linkData = getContentLinkDataWithJsonValue(item?.link?.data);
          const linkId = item?.linkID || item?.link?.id;
          return {
            ...linkData,
            id: linkId,
            link: item?.link?.url,
            linkStreamId: linkId,
          };
        }),
    [personalFavors]
  );

  const personalEvents = useMemo(
    () =>
      personalFavors
        .filter((item) => item?.link?.type === 'event')
        .map((item) => {
          const linkData = getEventLinkDataWithJsonValue(item?.link?.data);
          const linkId = item?.linkID || item?.link?.id;
          return {
            ...linkData,
            id: linkId,
            link: item?.link?.url,
            linkStreamId: linkId,
          };
        }),
    [personalFavors]
  );

  return { isFetching, personalContents, personalEvents };
};
