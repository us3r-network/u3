import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import NotificationMenu from './NotificationMenu';
import useFarcasterCurrFid from '@/hooks/social/farcaster/useFarcasterCurrFid';
import { NotificationType } from '@/services/notification/types/notifications';
import NotificationMobileHeader from './NotificationMobileHeader';

export default function NotificationLayout() {
  const fid = Number(useFarcasterCurrFid());
  const { pathname } = useLocation();
  const type = useMemo(() => {
    switch (pathname) {
      case '/notification/activity':
        return [
          NotificationType.REACTION,
          NotificationType.FOLLOW,
          NotificationType.REPLY,
        ];
      case '/notification/mention':
        return [NotificationType.MENTION];
      default:
        return [
          NotificationType.REACTION,
          NotificationType.FOLLOW,
          NotificationType.REPLY,
          NotificationType.MENTION,
        ];
    }
  }, [pathname]);
  return (
    <div className="w-full h-full flex">
      <div className="w-[280px] h-full max-sm:hidden">
        <NotificationMenu />
      </div>
      <div className="flex-1 h-full overflow-auto">
        <NotificationMobileHeader className="w-full sm:hidden" />
        <Outlet
          context={{
            fid,
            type,
          }}
        />
      </div>
    </div>
  );
}
