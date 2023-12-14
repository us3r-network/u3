/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 15:02:12
 * @Description: file description
 */
import styled from 'styled-components';
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
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const fid = Number(useFarcasterCurrFid());

  return (
    <>
      {/* TODO: 这里使用了非常不优雅的做法，因为在没有拿到Lens
        Profile的情况下，无法使用Lens的useUnreadLensNotificationCount，所以这里使用了两套Notification组件，
        等Lens Hooks V2这里需要重构 */}
      {lensSessionProfileId ? (
        <NotificationStoreProvider
          config={{
            fid,
            lensProfileId: lensSessionProfileId,
          }}
        >
          <NotificationButton />
        </NotificationStoreProvider>
      ) : (
        fid > 0 && (
          <NotificationStoreProviderNoLens
            config={{
              fid,
            }}
          >
            <NotificationButtonNoLens />
          </NotificationStoreProviderNoLens>
        )
      )}
    </>
  );
}
function NotificationButton() {
  const { openNotificationModal, renderNavItemText, switchNavModal } = useNav();
  const { unreadCount, clearUnread } = useNotificationStore();

  return (
    <>
      <PcNavItem
        isActive={openNotificationModal}
        onClick={() => {
          if (unreadCount && !openNotificationModal) clearUnread();
          switchNavModal(NavModalName.Notification);
        }}
      >
        <PcNavItemIconBox isActive={openNotificationModal}>
          <BellSvg />
          {unreadCount > 0 && <RedDot />}
        </PcNavItemIconBox>
        {renderNavItemText(`Notifications`)}
        {unreadCount > 0 && <UnreadCountBadge>{unreadCount}</UnreadCountBadge>}
      </PcNavItem>

      <NotificationModal />
    </>
  );
}

function NotificationButtonNoLens() {
  const { openNotificationModal, renderNavItemText, switchNavModal } = useNav();
  const { unreadCount, clearUnread } = useNotificationStoreNoLens();

  return (
    <>
      <PcNavItem
        isActive={openNotificationModal}
        onClick={() => {
          if (unreadCount && !openNotificationModal) clearUnread();
          switchNavModal(NavModalName.Notification);
        }}
      >
        <PcNavItemIconBox isActive={openNotificationModal}>
          <BellSvg />
          {unreadCount > 0 && <RedDot />}
        </PcNavItemIconBox>
        {renderNavItemText(`Notifications`)}
        {unreadCount > 0 && <UnreadCountBadge>{unreadCount}</UnreadCountBadge>}
      </PcNavItem>
      <NotificationModalNoLens />
    </>
  );
}

const UnreadCountBadge = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: #f81775;
  font-size: 10px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
`;
const RedDot = styled.div`
  min-width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #f81775;
  font-size: 10px;
  color: #fff;
  position: absolute;
  right: 0;
  top: 0;
`;
