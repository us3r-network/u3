import { useOutletContext } from 'react-router-dom';
import { useIsAuthenticated } from '@us3r-network/auth-with-rainbowkit';
import {
  NotificationStoreProvider,
  useNotificationStore,
} from '@/contexts/notification/NotificationStoreCtx';
import NotificationList from '@/components/notification/ui/NotificationList';
import { NotificationSettingsGroup } from '@/components/notification/PushNotificationsToogleBtn';
import { NotificationType } from '@/services/notification/types/notifications';
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
      {/* {isPwa && ( */}
      <div className="text-white flex items-center justify-between pt-[10px]">
        <h2 className="text-white font-bold">Notifications</h2>
        <NotificationSettingsGroup />
      </div>
      {/* )} */}

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
