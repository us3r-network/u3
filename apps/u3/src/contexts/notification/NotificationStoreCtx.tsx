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
  Notification as LensNotification,
  LimitType,
} from '@lens-protocol/react-web';

import useFarcasterNotifications from '../../hooks/social/farcaster/useFarcasterNotifications';
import useUnreadFarcasterNotificationsCount from '../../hooks/social/farcaster/useUnreadFarcasterNotificationsCount';
import { FarcasterNotification } from '../../services/social/api/farcaster';

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

// const mergeNotifications = (
//   lensNotifications: LensNotification[] | undefined,
//   farcasterNotifications: FarcasterNotification[] | undefined
// ) => {
//   if (!lensNotifications && !farcasterNotifications) {
//     return [] as (LensNotification | FarcasterNotification)[];
//   }
//   if (
//     (!lensNotifications || lensNotifications.length === 0) &&
//     farcasterNotifications
//   ) {
//     return farcasterNotifications as (
//       | LensNotification
//       | FarcasterNotification
//     )[];
//   }
//   if (
//     lensNotifications &&
//     (!farcasterNotifications || farcasterNotifications.length === 0)
//   ) {
//     return lensNotifications as (LensNotification | FarcasterNotification)[];
//   }
//   if (
//     lensNotifications &&
//     farcasterNotifications &&
//     lensNotifications.length > 0 &&
//     farcasterNotifications.length > 0
//   ) {
//     const notifications = [];
//     let lensIndex = 0;
//     let farcasterIndex = 0;
//     while (
//       lensIndex < lensNotifications.length &&
//       farcasterIndex < farcasterNotifications.length
//     ) {
//       if (lensNotifications.length === 0 && farcasterNotifications.length > 0) {
//         notifications.push(farcasterNotifications[farcasterIndex]);
//         farcasterIndex++;
//       } else if (
//         farcasterNotifications.length === 0 &&
//         lensNotifications.length > 0
//       ) {
//         notifications.push(lensNotifications[lensIndex]);
//         lensIndex++;
//       } else if (
//         lensNotifications[lensIndex].createdAt >
//         farcasterNotifications[farcasterIndex].message_timestamp
//       ) {
//         notifications.push(lensNotifications[lensIndex]);
//         lensIndex++;
//       } else {
//         notifications.push(farcasterNotifications[farcasterIndex]);
//         farcasterIndex++;
//       }
//     }
//     return notifications;
//   }
//   return [] as (LensNotification | FarcasterNotification)[];
// };

// this is a temp merge function
// because notification type in lens sdk, which is NOT completed yet, has NO timestamp to compare
// so we need to merge lens notification and farcaster notification one by one
const mergeNotifications = (
  lensNotifications: LensNotification[] | undefined,
  farcasterNotifications: FarcasterNotification[] | undefined
) => {
  const lensLength = lensNotifications?.length || 0;
  const farcasterLength = farcasterNotifications?.length || 0;
  const notifications = [];
  let lensIndex = 0;
  let farcasterIndex = 0;
  while (notifications.length < lensLength + farcasterLength) {
    const fcastItem = (farcasterNotifications || [])[farcasterIndex];
    const lensItem = (lensNotifications || [])[lensIndex];
    if (fcastItem && lensItem) {
      if (farcasterIndex <= lensIndex) {
        notifications.push(fcastItem);
        farcasterIndex++;
      } else {
        notifications.push(lensItem);
        lensIndex++;
      }
    } else if (fcastItem) {
      notifications.push(fcastItem);
      farcasterIndex++;
    } else if (lensItem) {
      notifications.push(lensItem);
      lensIndex++;
    }
  }
  return notifications;
};

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
  const [unreadCount, setUnreadCount] = useState(
    defaultContextValue.unreadCount
  );

  let lensPageSize: LimitType;
  if (config.pageSize > 50) {
    lensPageSize = LimitType.Fifty;
  } else if (config.pageSize > 25) {
    lensPageSize = LimitType.TwentyFive;
  } else {
    lensPageSize = LimitType.Ten;
  }

  const {
    data: lensNotifications,
    loading: lensNotificationsLoading,
    hasMore: lensNotificationsHasMore,
    next: loadMoreLensNotifications,
  } = useLensNotifications({
    limit: lensPageSize,
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

  const notifications = useMemo(
    () => mergeNotifications(lensNotifications, farcasterNotifications),
    [lensNotifications, farcasterNotifications]
  );

  const {
    unreadNotificationCount: unreadFarcasterCount,
    clear: clearFarcasterUnread,
  } = useUnreadFarcasterNotificationsCount(config.fid);

  const loadMore = useCallback(async () => {
    if (lensNotificationsHasMore && !lensNotificationsLoading) {
      await loadMoreLensNotifications();
    }

    if (
      config.fid &&
      farcasterNotificationsHasMore &&
      !farcasterNotificationsLoading
    ) {
      await loadMoreFarcasterNotifications();
    }
  }, [
    lensNotificationsHasMore,
    lensNotificationsLoading,
    config.fid,
    farcasterNotificationsHasMore,
    farcasterNotificationsLoading,
  ]);

  const clearUnread = useCallback(async () => {
    await clearFarcasterUnread();
    setUnreadCount(0);
  }, [clearFarcasterUnread]);

  useEffect(() => {
    setUnreadCount(unreadFarcasterCount);
  }, [unreadFarcasterCount, config]);

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
