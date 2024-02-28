import { useIsAuthenticated } from '@us3r-network/auth-with-rainbowkit';
import useFarcasterCurrFid from '@/hooks/social/farcaster/useFarcasterCurrFid';
import {
  NotificationStoreProvider,
  useNotificationStore,
} from '@/contexts/notification/NotificationStoreCtx';
import NotificationList from '@/components/notification/ui/NotificationList';
import { NotificationSettingsGroup } from '@/components/notification/PushNotificationsToogleBtn';
// import isInstalledPwa from '@/utils/shared/isInstalledPwa';

export default function Notification() {
  const isAuthenticated = useIsAuthenticated();
  const fid = Number(useFarcasterCurrFid());
  if (!isAuthenticated) return null;
  return (
    <div className="w-full h-[calc(100vh-56px-40px)] px-4">
      <NotificationStoreProvider
        config={{
          fid,
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
      <div className="text-[white] flex gap-2 pt-[10px]">
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
