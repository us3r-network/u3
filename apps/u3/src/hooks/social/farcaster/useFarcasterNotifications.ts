import { useCallback, useEffect, useState } from 'react';
import { debounce, uniqBy } from 'lodash';

import {
  FarcasterNotification,
  getFarcasterNotifications,
} from '../../../services/social/api/farcaster';
import { NotificationType } from '@/services/notification/types/notifications';

export default function useFarcasterNotifications(
  fid: number,
  type: NotificationType[],
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
    if (!fid) return;
    setLoading(true);
    try {
      const resp = await getFarcasterNotifications({
        fid,
        pageSize,
        type,
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
        uniqBy([...farcasterNotifications, ...notifications], 'message_hash')
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
    if (loading) return;
    if (!fid) return;
    setLoading(true);
    try {
      const resp = await getFarcasterNotifications({ fid, pageSize, type });
      if (!resp?.data?.data) return;
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
      setFarcasterNotifications(uniqBy(notifications, 'message_hash'));
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
