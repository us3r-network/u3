import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';

import { getFarcasterFeeds } from '../../../services/social/api/farcaster';
import { FarCast } from '../../../services/social/types';

export default function useLoadFarcasterFeeds() {
  const [farcasterFeeds, setFarcasterFeeds] = useState<
    {
      data: FarCast;
      platform: 'farcaster';
    }[]
  >([]);
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[];
  }>({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState('');

  const loadMoreFarcasterFeeds = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterFeeds({ endFarcasterCursor: cursor });
      const { data, pageInfo, farcasterUserData: userData } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      userData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterFeeds([...farcasterFeeds, ...data]);
      setFarcasterUserData({ ...farcasterUserData, ...temp });
      setHasMore(pageInfo.hasNextPage);
      setCursor(pageInfo.endFarcasterCursor);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, cursor, farcasterFeeds, farcasterUserData]);

  const loadFarcasterFeeds = async () => {
    setLoading(true);
    try {
      const resp = await getFarcasterFeeds({});
      const { data, pageInfo, farcasterUserData: userData } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      userData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterFeeds(data);
      setFarcasterUserData({ ...farcasterUserData, ...temp });
      setHasMore(pageInfo.hasNextPage);
      setCursor(pageInfo.endFarcasterCursor);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounce(loadFarcasterFeeds, 500)();
  }, []);

  return {
    loading,
    farcasterFeeds,
    farcasterUserData,
    loadMoreFarcasterFeeds,
  };
}
