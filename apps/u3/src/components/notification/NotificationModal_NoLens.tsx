import InfiniteScroll from 'react-infinite-scroll-component';

import { useNotificationStore } from '../../contexts/NotificationStoreCtx_NoLens';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import Loading from '../common/loading/Loading';
import { useNav } from '../../contexts/NavCtx';

import {
  FarcasterNotificationItem,
  Header,
  NotificationList,
  NotificationListWraper,
  Title,
  Wrapper,
} from './NotificationModal';
import { LoadingMoreWrapper } from '../profile/FollowListWidgets';

export default function NotificationModalNoLens() {
  const { openNotificationModal, setOpenNotificationModal } = useNav();
  const { notifications, loading, hasMore, loadMore } = useNotificationStore();

  return (
    <Wrapper open={openNotificationModal}>
      <Header>
        <Title>Notifications</Title>
        <ModalCloseBtn onClick={() => setOpenNotificationModal(false)} />
      </Header>
      {notifications && notifications.length > 0 && (
        <NotificationListWraper id="notification-list-wraper">
          <InfiniteScroll
            dataLength={notifications.length}
            next={() => {
              if (loading) return;
              loadMore();
            }}
            hasMore={hasMore}
            loader={
              loading ? (
                <LoadingMoreWrapper>
                  <Loading scale={0.3} />
                </LoadingMoreWrapper>
              ) : null
            }
            scrollableTarget="notification-list-wraper"
            scrollThreshold="200px"
            endMessage="No More Notifications!"
            style={{
              color: '#718096',
              textAlign: 'center',
              lineHeight: '32px',
              fontSize: '14px',
            }}
          >
            <NotificationList>
              {notifications.map((notification) => {
                if ('message_hash' in notification) {
                  return (
                    <FarcasterNotificationItem
                      notification={notification}
                      key={Buffer.from(notification.message_hash).toString(
                        'hex'
                      )}
                    />
                  );
                }
                return null;
              })}
            </NotificationList>
          </InfiniteScroll>
        </NotificationListWraper>
      )}
    </Wrapper>
  );
}
