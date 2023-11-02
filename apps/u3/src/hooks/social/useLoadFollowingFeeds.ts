import { useCallback, useState } from 'react';
import {
  FeedsDataItem,
  FeedsPageInfo,
  getFollowingFeeds,
} from '../../services/social/api/feeds';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { SocialPlatform } from '../../services/social/types';

const DefaultPageInfo: FeedsPageInfo = {
  hasNextPage: false,
  endFarcasterCursor: '',
  endLensCursor: '',
};

export function useLoadFollowingFeeds() {
  const { setFarcasterUserData } = useFarcasterCtx();

  const [feeds, setFeeds] = useState<{ [key: string]: Array<FeedsDataItem> }>(
    {}
  );

  const [pageInfo, setPageInfo] = useState<FeedsPageInfo>(DefaultPageInfo);
  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const loadFirstFeeds = useCallback(
    async (
      parentId: string,
      opts?: {
        keyword?: string;
        activeLensProfileId?: string;
        address?: string;
        fid?: string;
        platforms?: SocialPlatform[];
      }
    ) => {
      const { address = '', fid = '' } = opts || {};
      setFirstLoading(true);
      setPageInfo(DefaultPageInfo);
      try {
        const res = await getFollowingFeeds({
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
          address,
          fid,
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
        setFeeds((prev) => ({ ...prev, [parentId]: [] }));
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
        address?: string;
        fid?: string;
        platforms?: SocialPlatform[];
      }
    ) => {
      const { address = '', fid = '' } = opts || {};
      if (firstLoading || moreLoading || !pageInfo.hasNextPage) return;

      setMoreLoading(true);
      setPageInfo(DefaultPageInfo);
      try {
        const res = await getFollowingFeeds({
          endFarcasterCursor: pageInfo.endFarcasterCursor,
          endLensCursor: pageInfo.endLensCursor,
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
          address,
          fid,
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
