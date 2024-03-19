import { useCallback, useEffect, useState } from 'react';
import useUnreadFarcasterNotificationsCount from './farcaster/useUnreadFarcasterNotificationsCount';
import useFarcasterCurrFid from './farcaster/useFarcasterCurrFid';
// todo: add lens notification count
export default function useUnreadNotificationsCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fid = Number(useFarcasterCurrFid());
  const {
    unreadNotificationCount: unreadFarcasterCount,
    clear: clearFarcasterUnread,
  } = useUnreadFarcasterNotificationsCount(fid);

  const clearUnread = useCallback(async () => {
    await clearFarcasterUnread();
    setUnreadCount(0);
  }, [clearFarcasterUnread]);

  useEffect(() => {
    setUnreadCount(unreadFarcasterCount);
  }, [unreadFarcasterCount]);

  return {
    unreadCount,
    clearUnread,
  };
}
