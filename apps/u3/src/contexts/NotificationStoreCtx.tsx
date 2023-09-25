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

import {
  useNotifications as useLensNotifications,
  useUnreadNotificationCount as useUnreadLensNotificationCount,
  Notification as LensNotification,
  ProfileId,
} from '@lens-protocol/react-web';

import { debounce } from 'lodash';
import useFarcasterNotifications from '../hooks/farcaster/useFarcasterNotifications';
import useUnreadFarcasterNotificationsCount from '../hooks/farcaster/useUnreadFarcasterNotificationsCount';
import { FarcasterNotification } from '../api/farcaster';

interface NotificationStoreCtxValue {
  notifications: (LensNotification | FarcasterNotification)[] | undefined;
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

const mergeNotifications = (
  lensNotifications: LensNotification[] | undefined,
  farcasterNotifications: FarcasterNotification[] | undefined
) => {
  if (!lensNotifications && !farcasterNotifications) {
    return [] as (LensNotification | FarcasterNotification)[];
  }
  if (
    (!lensNotifications || lensNotifications.length === 0) &&
    farcasterNotifications
  ) {
    return farcasterNotifications as (
      | LensNotification
      | FarcasterNotification
    )[];
  }
  if (
    lensNotifications &&
    (!farcasterNotifications || farcasterNotifications.length === 0)
  ) {
    return lensNotifications as (LensNotification | FarcasterNotification)[];
  }
  if (
    lensNotifications &&
    farcasterNotifications &&
    lensNotifications.length > 0 &&
    farcasterNotifications.length > 0
  ) {
    const notifications = [];
    let lensIndex = 0;
    let farcasterIndex = 0;
    while (
      lensIndex < lensNotifications.length &&
      farcasterIndex < farcasterNotifications.length
    ) {
      if (lensNotifications.length === 0 && farcasterNotifications.length > 0) {
        notifications.push(farcasterNotifications[farcasterIndex]);
        farcasterIndex++;
      } else if (
        farcasterNotifications.length === 0 &&
        lensNotifications.length > 0
      ) {
        notifications.push(lensNotifications[lensIndex]);
        lensIndex++;
      } else if (
        lensNotifications[lensIndex].createdAt >
        farcasterNotifications[farcasterIndex].message_timestamp
      ) {
        notifications.push(lensNotifications[lensIndex]);
        lensIndex++;
      } else {
        notifications.push(farcasterNotifications[farcasterIndex]);
        farcasterIndex++;
      }
    }
    return notifications;
  }
  return [] as (LensNotification | FarcasterNotification)[];
};

export type NotificationConfig = {
  fid: number;
  lensProfileId: undefined | ProfileId;
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

  // get unread notification count
  const { unreadNotificationCount: unreadLensCount, clear: clearLensUnread } =
    useUnreadLensNotificationCount({
      profileId: config.lensProfileId,
    });

  const {
    data: lensNotifications,
    loading: lensNotificationsLoading,
    hasMore: lensNotificationsHasMore,
    next: loadMoreLensNotifications,
  } = useLensNotifications({
    profileId: config.lensProfileId,
    limit: config.pageSize || DEFAULT_PAGE_SIZE,
    highSignalFilter: false,
  });

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
    if (lensNotifications && farcasterNotifications) {
      setNotifications(
        mergeNotifications(lensNotifications, farcasterNotifications)
      );
    }
  }, [lensNotifications, farcasterNotifications, farcasterUserData]);

  const loadMore = useCallback(async () => {
    if (
      config.lensProfileId &&
      lensNotificationsHasMore &&
      !lensNotificationsLoading
    ) {
      await loadMoreLensNotifications();
    }

    if (
      config.fid &&
      farcasterNotificationsHasMore &&
      !farcasterNotificationsLoading
    ) {
      await loadMoreFarcasterNotifications();
    }
    // console.log('load more', { lensNotifications, farcasterNotifications });
    updateNotifications();
  }, [
    lensNotificationsLoading,
    farcasterNotificationsLoading,
    lensNotifications,
    farcasterNotifications,
  ]);

  const clearUnread = useCallback(async () => {
    if (clearLensUnread) {
      await clearLensUnread();
      await clearFarcasterUnread();
    }
    setUnreadCount(0);
  }, [clearLensUnread, clearFarcasterUnread]);

  useEffect(() => {
    debounce(updateNotifications, 500)();
  }, [updateNotifications, config]);

  useEffect(() => {
    console.log({ unreadLensCount, unreadFarcasterCount });
    setUnreadCount(unreadLensCount + unreadFarcasterCount);
  }, [unreadLensCount, unreadFarcasterCount, config]);

  return (
    <NotificationStoreCtx.Provider
      value={useMemo(
        () => ({
          loading: lensNotificationsLoading || farcasterNotificationsLoading,
          hasMore: lensNotificationsHasMore || farcasterNotificationsHasMore,
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
