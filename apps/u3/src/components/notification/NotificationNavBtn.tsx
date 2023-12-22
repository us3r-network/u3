/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import { useIsAuthenticated } from '@us3r-network/auth-with-rainbowkit';
import { PcNavItem, PcNavItemIconBox } from '../layout/Nav';
import { ReactComponent as BellSvg } from '../../route/svgs/bell.svg';
import {
  useNotificationStore,
  NotificationStoreProvider,
} from '../../contexts/notification/NotificationStoreCtx';
import NotificationModal from './NotificationModal';
import useFarcasterCurrFid from '../../hooks/social/farcaster/useFarcasterCurrFid';
import { NavModalName, useNav } from '../../contexts/NavCtx';

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
  const { openNotificationModal, switchNavModal } = useNav();
  const { unreadCount, clearUnread } = useNotificationStore();

  return (
    <>
      <NotificationButtonStyled
        unreadCount={unreadCount}
        isActive={openNotificationModal}
        onClick={() => {
          if (unreadCount && !openNotificationModal) clearUnread();
          switchNavModal(NavModalName.Notification);
        }}
      />

      <NotificationModal />
    </>
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
  const { renderNavItemText } = useNav();
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
      {renderNavItemText(`Notifications`)}
      {unreadCount > 0 && (
        <div
          className="
            w-[16px]
            h-[16px]
            rounded-[4px]
            bg-[#f81775]
            text-[10px]
            text-[#fff]
            flex
            justify-center
            items-center
            ml-auto
          "
        >
          {unreadCount}
        </div>
      )}
    </PcNavItem>
  );
}
