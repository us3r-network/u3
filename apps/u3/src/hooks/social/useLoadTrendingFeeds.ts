import { useCallback, useState } from 'react';
import {
  FeedsDataItem,
  FeedsPageInfo,
  getTrendingFeeds,
} from '../../services/social/api/feeds';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { SocialPlatform } from '../../services/social/types';

export function useLoadTrendingFeeds() {
  const { setFarcasterUserData } = useFarcasterCtx();

  const [feeds, setFeeds] = useState<{ [key: string]: Array<FeedsDataItem> }>(
    {}
  );

  const [pageInfo, setPageInfo] = useState<FeedsPageInfo>({
    hasNextPage: false,
    endFarcasterCursor: '',
    endLensCursor: '',
  });

  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const loadFirstFeeds = useCallback(
    async (
      parentId: string,
      opts?: {
        keyword?: string;
        activeLensProfileId?: string;
        platforms?: SocialPlatform[];
      }
    ) => {
      setFirstLoading(true);
      try {
        const res = await getTrendingFeeds({
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
          platforms: opts?.platforms?.length > 0 ? opts.platforms : undefined,
        });
        const {
          data,
          farcasterUserData,
          pageInfo: respPageInfo,
        } = res.data.data;
        const temp: { [key: string]: { type: number; value: string }[] } = {};
        farcasterUserData?.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        setFeeds((prev) => ({ ...prev, [parentId]: data }));
        setFarcasterUserData((pre) => ({ ...pre, ...temp }));
        setPageInfo(respPageInfo);
      } catch (error) {
        console.error(error);
      } finally {
        setFirstLoading(false);
      }
    },
    []
  );

  const loadMoreFeeds = useCallback(
    async (
      parentId: string,
      opts?: {
        keyword?: string;
        activeLensProfileId?: string;
        platforms?: SocialPlatform[];
      }
    ) => {
      if (firstLoading || moreLoading || !pageInfo.hasNextPage) return;
      setMoreLoading(true);
      try {
        const res = await getTrendingFeeds({
          endFarcasterCursor: pageInfo.endFarcasterCursor,
          endLensCursor: pageInfo.endLensCursor,
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
          platforms: opts?.platforms?.length > 0 ? opts.platforms : undefined,
        });
        const {
          data,
          farcasterUserData,
          pageInfo: newPageInfo,
        } = res.data.data;
        const temp: { [key: string]: { type: number; value: string }[] } = {};
        farcasterUserData?.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        setFeeds((prev) => ({
          ...prev,
          [parentId]: [...(prev[parentId] || []), ...data],
        }));
        setFarcasterUserData((pre) => ({ ...pre, ...temp }));
        setPageInfo(newPageInfo);
      } catch (error) {
        console.error(error);
      } finally {
        setMoreLoading(false);
      }
    },
    [pageInfo, firstLoading, moreLoading]
  );

  return {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  };
}
