/* eslint-disable no-plusplus */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import { debounce } from 'lodash';
import useFarcasterNotifications from '../hooks/farcaster/useFarcasterNotifications';
import useUnreadFarcasterNotificationsCount from '../hooks/farcaster/useUnreadFarcasterNotificationsCount';
import { FarcasterNotification } from '../api/farcaster';

interface NotificationStoreCtxValue {
  notifications: FarcasterNotification[] | undefined;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  unreadCount: number;
  clearUnread: () => void;
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

const defaultContextValue: NotificationStoreCtxValue = {
  notifications: [],
  farcasterUserData: {},
  unreadCount: 0,
  clearUnread: () => {},
  loading: false,
  hasMore: false,
  loadMore: () => {},
};

const DEFAULT_PAGE_SIZE = 10;
export const NotificationStoreCtx = createContext(defaultContextValue);

export type NotificationConfig = {
  fid: number;
  pageSize?: number;
};

export interface NotificationStoreProviderProps {
  children: ReactNode;
  config?: NotificationConfig;
}

export function NotificationStoreProvider({
  children,
  config,
}: NotificationStoreProviderProps) {
  const [notifications, setNotifications] = useState(
    defaultContextValue.notifications
  );
  const [unreadCount, setUnreadCount] = useState(
    defaultContextValue.unreadCount
  );

  // farcaster notifications
  const {
    farcasterNotifications,
    loading: farcasterNotificationsLoading,
    hasMore: farcasterNotificationsHasMore,
    loadMoreFarcasterNotifications,
    farcasterUserData,
  } = useFarcasterNotifications(
    config.fid,
    config.pageSize || DEFAULT_PAGE_SIZE
  );
  const {
    unreadNotificationCount: unreadFarcasterCount,
    clear: clearFarcasterUnread,
  } = useUnreadFarcasterNotificationsCount(config.fid);

  const updateNotifications = useCallback(() => {
    if (farcasterNotifications) {
      setNotifications(farcasterNotifications);
    }
  }, [farcasterNotifications, farcasterUserData]);

  const loadMore = useCallback(async () => {
    if (
      config.fid &&
      farcasterNotificationsHasMore &&
      !farcasterNotificationsLoading
    ) {
      await loadMoreFarcasterNotifications();
    }
    // console.log('load more', { lensNotifications, farcasterNotifications });
    updateNotifications();
  }, [farcasterNotificationsLoading, farcasterNotifications]);

  const clearUnread = useCallback(async () => {
    await clearFarcasterUnread();
    setUnreadCount(0);
  }, [clearFarcasterUnread]);

  useEffect(() => {
    debounce(updateNotifications, 500)();
  }, [updateNotifications, config]);

  useEffect(() => {
    setUnreadCount(unreadFarcasterCount);
  }, [unreadFarcasterCount, config]);

  return (
    <NotificationStoreCtx.Provider
      value={useMemo(
        () => ({
          loading: farcasterNotificationsLoading,
          hasMore: farcasterNotificationsHasMore,
          loadMore,
          notifications,
          farcasterUserData,
          unreadCount,
          clearUnread,
        }),
        [loadMore, notifications, unreadCount, clearUnread]
      )}
    >
      {children}
    </NotificationStoreCtx.Provider>
  );
}

export const useNotificationStore = () => {
  const ctx = useContext(NotificationStoreCtx);
  if (!ctx) {
    throw new Error(
      'useNotificationStore must be used within NotificationStoreProvider'
    );
  }
  return ctx;
};
