import { usePersonalFavors } from '@us3r-network/link';
import { useMemo } from 'react';
import { getContentLinkDataWithJsonValue } from '../utils/content';
import { getEventLinkDataWithJsonValue } from '../utils/event';

export default () => {
  const { isFetching, personalFavors } = usePersonalFavors();
  console.log('personalFavors', personalFavors);

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
