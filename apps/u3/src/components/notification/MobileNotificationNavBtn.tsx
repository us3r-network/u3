import { useIsAuthenticated } from '@us3r-network/auth-with-rainbowkit';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PcNavItem, PcNavItemIconBox } from '../layout/Nav';
import { ReactComponent as BellSvg } from '../../route/svgs/bell.svg';
import {
  useNotificationStore,
  NotificationStoreProvider,
} from '../../contexts/notification/NotificationStoreCtx';
import useFarcasterCurrFid from '../../hooks/social/farcaster/useFarcasterCurrFid';
import useRoute from '@/route/useRoute';
import { RouteKey } from '@/route/routes';

export default function NotificationButtonContainer() {
  const isAuthenticated = useIsAuthenticated();
  const fid = Number(useFarcasterCurrFid());
  if (!isAuthenticated) return null;
  return (
    <NotificationStoreProvider
      config={{
        fid,
      }}
    >
      <NotificationButton />
    </NotificationStoreProvider>
  );
}

function NotificationButton() {
  const navigate = useNavigate();
  const { unreadCount, clearUnread } = useNotificationStore();
  const { firstRouteMeta } = useRoute();
  const isActive = useMemo(
    () => firstRouteMeta.key === RouteKey.notification,
    [firstRouteMeta]
  );

  return (
    <NotificationButtonStyled
      unreadCount={unreadCount}
      isActive={isActive}
      onClick={() => {
        if (unreadCount && !isActive) clearUnread();
        navigate('/notification');
      }}
    />
  );
}

function NotificationButtonStyled({
  unreadCount,
  isActive,
  onClick,
}: {
  unreadCount: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <PcNavItem isActive={isActive} onClick={onClick}>
      <PcNavItemIconBox isActive={isActive}>
        <BellSvg />
        {unreadCount > 0 && (
          <div
            className="
              min-w-[6px]
              h-[6px]
              rounded-[50%]
              bg-[#f81775]
              text-[10px]
              text-[#fff]
              absolute
              right-[0]
              top-[0]
            "
          />
        )}
      </PcNavItemIconBox>
    </PcNavItem>
  );
}
