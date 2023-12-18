/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import styled from 'styled-components';
import { useIsAuthenticated } from '@us3r-network/auth-with-rainbowkit';
import { PcNavItem, PcNavItemIconBox } from './Nav';
import { ReactComponent as BellSvg } from '../../route/svgs/bell.svg';
import {
  useNotificationStore,
  NotificationStoreProvider,
} from '../../contexts/notification/NotificationStoreCtx';
import {
  useNotificationStore as useNotificationStoreNoLens,
  NotificationStoreProvider as NotificationStoreProviderNoLens,
} from '../../contexts/notification/NotificationStoreCtx_NoLens';
import NotificationModal from '../notification/NotificationModal';
import NotificationModalNoLens from '../notification/NotificationModal_NoLens';
import useFarcasterCurrFid from '../../hooks/social/farcaster/useFarcasterCurrFid';
import { NavModalName, useNav } from '../../contexts/NavCtx';
import { useLensCtx } from '../../contexts/social/AppLensCtx';

export default function NotificationButtonContainer() {
  const isAuthenticated = useIsAuthenticated();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const fid = Number(useFarcasterCurrFid());
  if (!isAuthenticated) return null;
  return (
    <>
      {/* TODO: 这里使用了非常不优雅的做法，因为在没有拿到Lens
        Profile的情况下，无法使用Lens的useUnreadLensNotificationCount，所以这里使用了两套Notification组件，
        等Lens Hooks V2这里需要重构 */}
      {!lensSessionProfileId ? (
        <NotificationStoreProviderNoLens
          config={{
            fid,
          }}
        >
          <NotificationButtonNoLens />
        </NotificationStoreProviderNoLens>
      ) : (
        <NotificationStoreProvider
          config={{
            fid,
            lensProfileId: lensSessionProfileId,
          }}
        >
          <NotificationButton />
        </NotificationStoreProvider>
      )}
    </>
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

function NotificationButtonNoLens() {
  const { openNotificationModal, switchNavModal } = useNav();
  const { unreadCount, clearUnread } = useNotificationStoreNoLens();

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
      <NotificationModalNoLens />
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
