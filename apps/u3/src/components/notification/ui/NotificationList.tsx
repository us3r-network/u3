/* eslint-disable no-underscore-dangle */
import InfiniteScroll from 'react-infinite-scroll-component';
import { ComponentPropsWithRef } from 'react';
import { Notification as LensNotification } from '@lens-protocol/react-web';
import Loading from '../../common/loading/Loading';
import FarcasterNotificationItem from '../farcaster/FarcasterNotificationItem';
import LensNotificationItem from '../lens/LensNotificationItem';
import { cn } from '@/lib/utils';
import { FarcasterNotification } from '@/services/social/api/farcaster';

interface NotificationListProps extends ComponentPropsWithRef<'div'> {
  notifications: (LensNotification | FarcasterNotification)[] | undefined;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}
export default function NotificationList({
  notifications,
  loading,
  hasMore,
  loadMore,
  farcasterUserData,
  className,
  ...divProps
}: NotificationListProps) {
  return (
    <div
      id="notification-list-wraper"
      className={cn('h-full overflow-y-auto', className)}
      {...divProps}
    >
      {notifications && notifications.length > 0 && (
        <InfiniteScroll
          dataLength={notifications.length}
          next={() => {
            if (loading) return;
            loadMore();
          }}
          hasMore={hasMore}
          loader={
            loading ? (
              <div className="w-full flex justify-center items-center py-[20px]">
                <Loading scale={0.3} />
              </div>
            ) : null
          }
          scrollableTarget="notification-list-wraper"
          scrollThreshold="200px"
          endMessage="No More Notifications!"
        >
          {notifications.map((notification) => {
            if ('message_hash' in notification) {
              return (
                <FarcasterNotificationItem
                  notification={notification}
                  farcasterUserData={farcasterUserData}
                  key={Buffer.from(notification.message_hash).toString('hex')}
                />
              );
            }
            if ('id' in notification) {
              return (
                <LensNotificationItem
                  key={notification.id}
                  notification={notification}
                />
              );
            }
            return null;
          })}
        </InfiniteScroll>
      )}
    </div>
  );
}
