import { useIsAuthenticated } from '@us3r-network/auth-with-rainbowkit';
import useFarcasterCurrFid from '@/hooks/social/farcaster/useFarcasterCurrFid';
import {
  NotificationStoreProvider,
  useNotificationStore,
} from '@/contexts/notification/NotificationStoreCtx';
import NotificationList from '@/components/notification/ui/NotificationList';

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

  return (
    <NotificationList
      notifications={notifications}
      farcasterUserData={farcasterUserData}
      loading={loading}
      hasMore={hasMore}
      loadMore={loadMore}
    />
  );
}
