import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';

import { FeedsType } from 'src/components/social/SocialPageNav';

export default function useListFeeds(parentId: string) {
  const {
    trendingFeeds,
    followingFeeds,
    feedsType,

    followingFirstLoading,
    followingPageInfo,
    followingMoreLoading,

    trendingMoreLoading,
    trendingPageInfo,
    trendingFirstLoading,
  } = useOutletContext<any>();

  const feeds = useMemo(() => {
    if (feedsType === FeedsType.TRENDING) {
      return trendingFeeds[parentId] || [];
    }
    return followingFeeds[parentId] || [];
  }, [feedsType, trendingFeeds, followingFeeds, parentId]);

  const firstLoading = useMemo(
    () =>
      feedsType === FeedsType.TRENDING
        ? trendingFirstLoading
        : followingFirstLoading,
    [feedsType, trendingFirstLoading, followingFirstLoading]
  );

  const pageInfo = useMemo(
    () =>
      feedsType === FeedsType.TRENDING ? trendingPageInfo : followingPageInfo,
    [feedsType, trendingPageInfo, followingPageInfo]
  );
  const moreLoading = useMemo(
    () =>
      feedsType === FeedsType.TRENDING
        ? trendingMoreLoading
        : followingMoreLoading,
    [feedsType, trendingMoreLoading, followingMoreLoading]
  );
  return { feeds, firstLoading, pageInfo, moreLoading };
}
