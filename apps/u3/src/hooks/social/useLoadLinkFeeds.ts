import { useCallback, useState } from 'react';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { SocialPlatform } from '../../services/social/types';
import { getLinkFeeds } from '@/services/social/api/farcaster';

export function useLoadLinkFeeds() {
  const { setFarcasterUserData } = useFarcasterCtx();

  const [feeds, setFeeds] = useState([]);

  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endFarcasterCursor: '',
    endLensCursor: '',
  });

  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const loadFirstFeeds = useCallback(
    async (
      url: string,
      opts?: {
        keyword?: string;
        activeLensProfileId?: string;
        platforms?: SocialPlatform[];
      }
    ) => {
      setFirstLoading(true);
      try {
        const res = await getLinkFeeds({
          link: url,
          activeLensProfileId: opts?.activeLensProfileId,
          keyword: opts?.keyword,
          platforms: opts?.platforms?.length > 0 ? opts.platforms : undefined,
        });
        const {
          casts,
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
        setFeeds(casts);
        setFarcasterUserData((pre) => ({ ...pre, ...temp }));
        setPageInfo(newPageInfo);
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
      url: string,
      opts?: {
        keyword?: string;
        activeLensProfileId?: string;
        platforms?: SocialPlatform[];
      }
    ) => {
      if (firstLoading || moreLoading || !pageInfo.hasNextPage) return;
      setMoreLoading(true);
      try {
        const res = await getLinkFeeds({
          link: url,
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
        console.log({ feeds, data });
        setFeeds(Array.from(new Set([...feeds, ...data])));
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
