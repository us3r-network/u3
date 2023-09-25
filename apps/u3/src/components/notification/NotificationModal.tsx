/* eslint-disable no-underscore-dangle */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Notification as LensNotification,
  Post,
} from '@lens-protocol/react-web';

import { MessageType, ReactionType } from '@farcaster/hub-web';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import { useNotificationStore } from '../../contexts/NotificationStoreCtx';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import { FarcasterNotification } from '../../api/farcaster';
import useFarcasterUserData from '../../hooks/farcaster/useFarcasterUserData';
import getAvatar from '../../utils/lens/getAvatar';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import Loading from '../common/loading/Loading';
import { useNav } from '../../contexts/NavCtx';

export default function NotificationModal() {
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
                  <Loading />
                </LoadingMoreWrapper>
              ) : null
            }
            scrollableTarget="notification-list-wraper"
          >
            <NotificationList>
              {notifications.map((notification) => {
                if ('notificationId' in notification) {
                  return (
                    <NotificationItemWraper key={notification.notificationId}>
                      <LensIcon />
                      <LensNotificationItem notification={notification} />
                    </NotificationItemWraper>
                  );
                }
                if ('message_hash' in notification) {
                  return (
                    <NotificationItemWraper
                      key={Buffer.from(notification.message_hash).toString(
                        'hex'
                      )}
                    >
                      <FarcasterIcon />
                      <FarcasterNotificationItem notification={notification} />
                    </NotificationItemWraper>
                  );
                }
                return null;
              })}
              {/* {hasMore && (
                <button type="submit" onClick={loadMore} disabled={loading}>
                  Load More
                </button>
              )} */}
            </NotificationList>
          </InfiniteScroll>
        </NotificationListWraper>
      )}
    </Wrapper>
  );
}

interface FarcasterNotificationItemProps {
  notification: FarcasterNotification;
}

function FarcasterNotificationItem({
  notification,
}: StyledComponentPropsWithRef<'div'> & FarcasterNotificationItemProps) {
  const { farcasterUserData } = useNotificationStore();
  const navigate = useNavigate();
  const userData = useFarcasterUserData({
    fid: String(notification.message_fid),
    farcasterUserData,
  });
  const id = Buffer.from(notification.message_hash).toString('hex');
  switch (notification.message_type) {
    case MessageType.CAST_ADD:
      return (
        <NotificationItem
          onClick={() => {
            navigate(`/social/post-detail/fcast/${id}`);
          }}
        >
          <Avatar src={userData.pfp} />
          <div>
            <p>
              <UserName>{userData.userName}</UserName> commented on your cast
            </p>
            <p>
              <PostText>{notification.text}</PostText>
            </p>
            <p>
              <DateText>
                {dayjs(notification.message_timestamp).fromNow()}
              </DateText>
            </p>
          </div>
        </NotificationItem>
      );
      break;
    case MessageType.REACTION_ADD:
      switch (notification.reaction_type) {
        case ReactionType.LIKE:
          return (
            <NotificationItem
              onClick={() => {
                navigate(`/social/post-detail/fcast/${id}`);
              }}
            >
              <Avatar src={userData.pfp} />
              <div>
                <p>
                  <UserName>{userData.userName}</UserName> liked your cast
                </p>
                <p>
                  <PostText>{notification.text}</PostText>
                </p>
                <p>
                  <DateText>
                    {dayjs(notification.message_timestamp).fromNow()}
                  </DateText>
                </p>
              </div>
            </NotificationItem>
          );
          break;
        case ReactionType.RECAST:
          return (
            <NotificationItem
              onClick={() => {
                navigate(`/social/post-detail/fcast/${id}`);
              }}
            >
              <Avatar src={userData.pfp} />
              <div>
                <p>
                  <UserName>{userData.userName}</UserName> recast your cast
                </p>
                <p>
                  <PostText>{notification.text}</PostText>
                </p>
                <p>
                  <DateText>
                    {dayjs(notification.message_timestamp).fromNow()}
                  </DateText>
                </p>
              </div>
            </NotificationItem>
          );
          break;
        default:
          break;
      }
      break;
    case MessageType.LINK_ADD:
      return (
        <NotificationItem>
          <Avatar src={userData.pfp} />
          <div>
            <p>
              <UserName>{userData.userName}</UserName> follows you
            </p>
            <p>
              <DateText>
                {dayjs(notification.message_timestamp).fromNow()}
              </DateText>
            </p>
          </div>
        </NotificationItem>
      );
      break;
    default:
      return null;
  }
}

interface LensNotificationItemProps {
  notification: LensNotification;
}

enum LensNotificationType {
  NEW_FOLLOWER = 'NewFollowerNotification',
  NEW_COLLECT = 'NewCollectNotification',
  NEW_COMMENT = 'NewCommentNotification',
  NEW_MIRROR = 'NewMirrorNotification',
  NEW_MENTION = 'NewMentionNotification',
  NEW_REACTION = 'NewReactionNotification',
}

function LensNotificationItem({
  notification,
}: StyledComponentPropsWithRef<'div'> & LensNotificationItemProps) {
  const navigate = useNavigate();
  switch (notification.__typename) {
    case LensNotificationType.NEW_COMMENT:
      return (
        <NotificationItem
          onClick={() => {
            navigate(`/social/post-detail/lens/${notification.comment.id}`);
          }}
        >
          <Avatar src={getAvatar(notification.profile)} />
          <div>
            <p>
              <UserName>{notification.profile.name}</UserName> commented on your
              post
            </p>
            <p>
              <PostText>{notification.comment.metadata.content}</PostText>
            </p>
            <p>
              <DateText>{dayjs(notification.createdAt).fromNow()}</DateText>
            </p>
          </div>
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_REACTION:
      return (
        <NotificationItem
          onClick={() => {
            navigate(`/social/post-detail/lens/${notification.publication.id}`);
          }}
        >
          <Avatar src={getAvatar(notification.profile)} />
          <div>
            <p>
              <UserName>{notification.profile.name}</UserName> like your cast
            </p>
            <p>
              <PostText>
                {(notification.publication as Post).metadata.content}
              </PostText>
            </p>
            <p>
              <DateText>{dayjs(notification.createdAt).fromNow()}</DateText>
            </p>
          </div>
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_MIRROR:
      return (
        <NotificationItem
          onClick={() => {
            navigate(`/social/post-detail/lens/${notification.publication.id}`);
          }}
        >
          <Avatar src={getAvatar(notification.profile)} />
          <div>
            <p>
              <UserName>{notification.profile.name}</UserName> recast your cast
            </p>
            <p>
              <PostText>{notification.publication.metadata.content}</PostText>
            </p>
            <p>
              <DateText>{dayjs(notification.createdAt).fromNow()}</DateText>
            </p>
          </div>
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_FOLLOWER:
      return (
        <NotificationItem>
          <Avatar src={getAvatar(notification.wallet.defaultProfile)} />
          <div>
            <p>
              <UserName>
                {notification.wallet.defaultProfile.name ||
                  notification.wallet.defaultProfile.handle}
              </UserName>{' '}
              follows you
            </p>
            <p>
              <DateText>{dayjs(notification.createdAt).fromNow()}</DateText>
            </p>
          </div>
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_COLLECT:
    default:
      return null;
  }
}

const Wrapper = styled.div<{ open: boolean }>`
  z-index: 3;
  width: 400px;
  height: 760px;
  max-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;

  position: absolute;
  bottom: 20px;
  right: -10px;
  transform: translateX(100%);

  display: ${({ open }) => (open ? 'block' : 'none')};
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Title = styled.h1`
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const NotificationListWraper = styled.div`
  width: 100%;
  height: 95%;
  margin-top: 20px;
  overflow: auto;
`;
const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 20px;
  height: 70%;
  overflow: hidden;
`;
const NotificationItemWraper = styled.div`
  display: inline-flex;
  &:hover {
    background-color: #39424c;
  }
  padding: 10px;
  cursor: pointer;
`;
const NotificationItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 20px;
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  /* line-height: normal; */
  div {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    gap: 0px;
    p {
      line-height: 0px;
    }
  }
`;
const Avatar = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 50%;
  margin-left: -2px;
  margin-top: 6px;
  object-fit: cover;
`;
const UserName = styled.span`
  text-decoration: underline;
`;
const PostText = styled.span`
  max-width: 100%;
  text-overflow: ellipsis;
  color: #718096;
  font-size: 16px;
  font-weight: 400;
`;
const DateText = styled.span`
  max-width: 100%;
  text-overflow: ellipsis;
  color: #718096;
  font-size: 12px;
  font-weight: 400;
`;
const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
