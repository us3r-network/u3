import { useCallback, useState } from 'react';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';
import {
  FeedsDataItem,
  FeedsPageInfo,
  getFeeds,
} from '../../services/social/api/feeds';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { SocialPlatform } from '../../services/social/types';

export function useLoadFeeds() {
  const { setFarcasterUserData } = useFarcasterCtx();

  const [feeds, setFeeds] = useState<Array<FeedsDataItem>>([]);

  const [pageInfo, setPageInfo] = useState<FeedsPageInfo>({
    hasNextPage: false,
    endFarcasterCursor: '',
    endLensCursor: '',
  });
  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const lensAccessToken = useLensAccessToken();
  const loadFirstFeeds = useCallback(
    async (opts?: { keyword?: string; platforms?: SocialPlatform[] }) => {
      setFirstLoading(true);
      try {
        const res = await getFeeds({
          keyword: opts?.keyword,
          platforms: opts?.platforms?.length > 0 ? opts.platforms : undefined,
          lensAccessToken,
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
        setFeeds(data);
        setFarcasterUserData((pre) => ({ ...pre, ...temp }));
        setPageInfo(respPageInfo);
      } catch (error) {
        setFeeds([]);
        console.error(error);
      } finally {
        setFirstLoading(false);
      }
    },
    [lensAccessToken]
  );

  const loadMoreFeeds = useCallback(
    async (opts?: { keyword?: string; platforms?: SocialPlatform[] }) => {
      if (firstLoading || moreLoading || !pageInfo.hasNextPage) return;
      setMoreLoading(true);
      try {
        const res = await getFeeds({
          endFarcasterCursor: pageInfo.endFarcasterCursor,
          endLensCursor: pageInfo.endLensCursor,
          keyword: opts?.keyword,
          platforms: opts?.platforms?.length > 0 ? opts.platforms : undefined,
          lensAccessToken,
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
        setFeeds((prev) => [...prev, ...data]);
        setFarcasterUserData((pre) => ({ ...pre, ...temp }));
        setPageInfo(newPageInfo);
      } catch (error) {
        console.error(error);
      } finally {
        setMoreLoading(false);
      }
    },
    [pageInfo, firstLoading, moreLoading, lensAccessToken]
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
