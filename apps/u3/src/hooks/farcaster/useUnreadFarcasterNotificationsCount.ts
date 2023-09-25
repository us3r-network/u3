import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import {
  getFarcasterUnreadNotificationCount,
  clearFarcasterUnreadNotification,
} from '../../api/farcaster';

export default function useUnreadFarcasterNotificationsCount(fid: number) {
  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastTime, setLastTime] = useState(null);

  const getUnreadNotificationCount = async () => {
    setLoading(true);
    try {
      const resp = await getFarcasterUnreadNotificationCount({ fid });
      setUnreadNotificationCount(resp.data.data.count);
      setLastTime(resp.data.data.lastTime);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounce(getUnreadNotificationCount, 500)();
  }, [fid, lastTime]);

  return {
    loading,
    unreadNotificationCount,
    clear: async (): Promise<void> => {
      const resp = await clearFarcasterUnreadNotification({ fid });
      setLastTime(resp.data.data.lastTime);
    },
  };
}
