import { useOutletContext } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import {
  NotificationStoreProvider,
  useNotificationStore,
} from '@/contexts/notification/NotificationStoreCtx';
import NotificationList from '@/components/notification/ui/NotificationList';
import { NotificationSettingsGroup } from '@/components/notification/PushNotificationsToogleBtn';
import { NotificationType } from '@/services/notification/types/notifications';
import NotificationMobileHeader from './NotificationMobileHeader';
// import isInstalledPwa from '@/utils/shared/isInstalledPwa';
export default function Notification() {
  const { fid, type } = useOutletContext<{
    fid: number;
    type?: NotificationType[];
  }>();
  return (
    <div className="w-full h-[calc(100vh-56px-40px)] px-4">
      <NotificationStoreProvider
        config={{
          fid,
          type,
        }}
      >
        <NotificationPage />
      </NotificationStoreProvider>
    </div>
  );
}
function NotificationPage() {
  const { notifications, loading, hasMore, loadMore, farcasterUserData } =
    useNotificationStore();

  // const isPwa = isInstalledPwa();
  return (
    <>
      {isMobile ? (
        <div className="w-full pt-2 text-right">
          <NotificationSettingsGroup />
        </div>
      ) : (
        <div className="flex items-center justify-between pt-4">
          <h2 className="text-white font-bold">Notifications</h2>
          <NotificationSettingsGroup />
        </div>
      )}

      <NotificationList
        notifications={notifications}
        farcasterUserData={farcasterUserData}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </>
  );
}
