import { useCallback, useEffect, useState } from 'react';
import { debounce, uniqBy } from 'lodash';

import {
  FarcasterNotification,
  getFarcasterNotifications,
} from '../../api/farcaster';

export default function useFarcasterNotifications(
  fid: number,
  pageSize: number
) {
  const [farcasterNotifications, setFarcasterNotifications] = useState<
    FarcasterNotification[]
  >([]);
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[];
  }>({});
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState('');

  const loadMoreFarcasterNotifications = useCallback(async () => {
    if (loading || !hasMore) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterNotifications({
        fid,
        pageSize,
        endFarcasterCursor: cursor,
      });
      const {
        notifications,
        pageInfo,
        farcasterUserData: userData,
      } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      userData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterNotifications(
        uniqBy([...farcasterNotifications, ...notifications], 'id')
      );
      setFarcasterUserData({ ...farcasterUserData, ...temp });
      if (pageInfo) {
        setHasMore(pageInfo.hasNextPage);
        setCursor(pageInfo.endFarcasterCursor);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    loading,
    hasMore,
    cursor,
    farcasterNotifications,
    farcasterUserData,
    fid,
  ]);

  const loadFarcasterNotifications = async () => {
    setLoading(true);
    try {
      const resp = await getFarcasterNotifications({ fid, pageSize });
      const {
        notifications,
        pageInfo,
        farcasterUserData: userData,
      } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      userData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterNotifications(uniqBy(notifications, 'id'));
      setFarcasterUserData({ ...farcasterUserData, ...temp });
      if (pageInfo) {
        setHasMore(pageInfo.hasNextPage);
        setCursor(pageInfo.endFarcasterCursor);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounce(loadFarcasterNotifications, 500)();
  }, [fid]);

  return {
    loading,
    hasMore,
    next: cursor,
    farcasterNotifications,
    farcasterUserData,
    loadMoreFarcasterNotifications,
  };
}
