/* eslint-disable no-underscore-dangle */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Notification as LensNotification } from '@lens-protocol/react-web';

import { MessageType, ReactionType } from '@farcaster/hub-web';
import InfiniteScroll from 'react-infinite-scroll-component';
import dayjs from 'dayjs';
import getContent from 'src/utils/social/lens/getContent';
import { getHandle, getName } from 'src/utils/social/lens/profile';
import { useNotificationStore } from '../../contexts/notification/NotificationStoreCtx';
import { ModalCloseBtn } from '../common/modal/ModalWidgets';
import { FarcasterNotification } from '../../services/social/api/farcaster';
import useFarcasterUserData from '../../hooks/social/farcaster/useFarcasterUserData';
import getAvatar from '../../utils/social/lens/getAvatar';
import LensIcon from '../common/icons/LensIcon';
import FarcasterIcon from '../common/icons/FarcasterIcon';
import Loading from '../common/loading/Loading';
import { useNav } from '../../contexts/NavCtx';

export default function NotificationModal() {
  const { openNotificationModal, setOpenNotificationModal } = useNav();
  const { notifications, loading, hasMore, loadMore, farcasterUserData } =
    useNotificationStore();
  return (
    <Wrapper open={openNotificationModal}>
      <Body>
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
                        farcasterUserData={farcasterUserData}
                        key={Buffer.from(notification.message_hash).toString(
                          'hex'
                        )}
                      />
                    );
                  }
                  if ('id' in notification) {
                    return (
                      <LensNotificationItem
                        key={notification.id}
                        notification={notification}
                      />
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
      </Body>
    </Wrapper>
  );
}

interface FarcasterNotificationItemProps {
  notification: FarcasterNotification;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
}

export function FarcasterNotificationItem({
  notification,
  farcasterUserData,
}: StyledComponentPropsWithRef<'div'> & FarcasterNotificationItemProps) {
  const navigate = useNavigate();
  const { setOpenNotificationModal } = useNav();
  const userData = useFarcasterUserData({
    fid: String(notification.message_fid),
    farcasterUserData,
  });
  switch (notification.message_type) {
    case MessageType.CAST_ADD:
      return (
        <NotificationItem
          onClick={() => {
            navigate(
              `/social/post-detail/fcast/${Buffer.from(
                notification.replies_parent_hash
              ).toString('hex')}#${Buffer.from(
                notification.casts_hash
              ).toString('hex')}`
            );
            setOpenNotificationModal(false);
          }}
        >
          <Avatar src={userData.pfp} />
          <UserActionWraper>
            <UserAction>
              <u>{userData.userName}</u> commented on your cast
            </UserAction>
            <PostText>{notification.replies_text}</PostText>
            <DateText>
              {dayjs(notification.message_timestamp).fromNow()}
            </DateText>
          </UserActionWraper>
          <FarcasterIcon />
        </NotificationItem>
      );
      break;
    case MessageType.REACTION_ADD:
      switch (notification.reaction_type) {
        case ReactionType.LIKE:
          return (
            <NotificationItem
              onClick={() => {
                navigate(
                  `/social/post-detail/fcast/${Buffer.from(
                    notification.casts_hash
                  ).toString('hex')}`
                );
                setOpenNotificationModal(false);
              }}
            >
              <Avatar src={userData.pfp} />
              <UserActionWraper>
                <UserAction>
                  <u>{userData.userName}</u> like your cast
                </UserAction>
                <PostText>{notification.casts_text}</PostText>
                <DateText>
                  {dayjs(notification.message_timestamp).fromNow()}
                </DateText>
              </UserActionWraper>
              <FarcasterIcon />
            </NotificationItem>
          );
          break;
        case ReactionType.RECAST:
          return (
            <NotificationItem
              onClick={() => {
                navigate(
                  `/social/post-detail/fcast/${Buffer.from(
                    notification.casts_hash
                  ).toString('hex')}`
                );
                setOpenNotificationModal(false);
              }}
            >
              <Avatar src={userData.pfp} />
              <UserActionWraper>
                <UserAction>
                  <u>{userData.userName}</u> recast your cast
                </UserAction>
                <PostText>{notification.casts_text}</PostText>
                <DateText>
                  {dayjs(notification.message_timestamp).fromNow()}
                </DateText>
              </UserActionWraper>
              <FarcasterIcon />
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
          <UserActionWraper>
            <UserAction>
              <u>{userData.userName}</u> follows you
            </UserAction>
            <DateText>
              {dayjs(notification.message_timestamp).fromNow()}
            </DateText>
          </UserActionWraper>
          <FarcasterIcon />
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
  NEW_FOLLOWER = 'FollowNotification',
  NEW_COMMENT = 'CommentNotification',
  NEW_MIRROR = 'MirrorNotification',
  NEW_MENTION = 'MentionNotification',
  NEW_REACTION = 'ReactionNotification',
}

function LensNotificationItem({
  notification,
}: StyledComponentPropsWithRef<'div'> & LensNotificationItemProps) {
  const navigate = useNavigate();
  const { setOpenNotificationModal } = useNav();
  switch (notification.__typename) {
    case LensNotificationType.NEW_COMMENT:
      return (
        <NotificationItem
          onClick={() => {
            navigate(
              `/social/post-detail/lens/${notification?.comment?.commentOn?.id}#${notification?.comment?.id}`
            );
            setOpenNotificationModal(false);
          }}
        >
          <Avatar src={getAvatar(notification.comment.by)} />
          <UserActionWraper>
            <UserAction>
              <u>
                {getName(notification.comment.by) ||
                  getHandle(notification.comment.by)}
              </u>{' '}
              commented on your post
            </UserAction>
            <PostText>{getContent(notification.comment.metadata)}</PostText>
            <DateText>
              {dayjs(notification.comment.createdAt).fromNow()}
            </DateText>
          </UserActionWraper>
          <LensIcon />
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_REACTION:
      return (
        <NotificationItem
          onClick={() => {
            navigate(`/social/post-detail/lens/${notification.publication.id}`);
            setOpenNotificationModal(false);
          }}
        >
          <Avatar src={getAvatar(notification.reactions[0].profile)} />
          <UserActionWraper>
            <UserAction>
              <u>
                {getName(notification.reactions[0].profile) ||
                  getHandle(notification.reactions[0].profile)}
              </u>{' '}
              like your post
            </UserAction>
            <PostText>{getContent(notification.publication.metadata)}</PostText>
            <DateText>
              {dayjs(
                notification.reactions[0].reactions[0].reactedAt
              ).fromNow()}
            </DateText>
          </UserActionWraper>
          <LensIcon />
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_MIRROR:
      return (
        <NotificationItem
          onClick={() => {
            navigate(`/social/post-detail/lens/${notification.publication.id}`);
            setOpenNotificationModal(false);
          }}
        >
          <Avatar src={getAvatar(notification.mirrors[0].profile)} />
          <UserActionWraper>
            <UserAction>
              <u>
                {getName(notification.mirrors[0].profile) ||
                  getHandle(notification.mirrors[0].profile)}
              </u>{' '}
              mirror your post
            </UserAction>
            <PostText>{getContent(notification.publication.metadata)}</PostText>
            <DateText>
              {dayjs(notification.mirrors[0].mirroredAt).fromNow()}
            </DateText>
          </UserActionWraper>
          <LensIcon />
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_FOLLOWER:
      return (
        <NotificationItem>
          <Avatar src={getAvatar(notification.followers[0])} />
          <UserActionWraper>
            <UserAction>
              <u>
                {getName(notification.followers[0]) ||
                  getHandle(notification.followers[0])}
              </u>{' '}
              follows you
            </UserAction>
            <DateText>
              {dayjs(notification.followers[0].createdAt).fromNow()}
            </DateText>
          </UserActionWraper>
          <LensIcon />
        </NotificationItem>
      );
      break;
    case LensNotificationType.NEW_MENTION:
      return (
        <NotificationItem>
          <Avatar src={getAvatar(notification.publication.by)} />
          <UserActionWraper>
            <UserAction>
              <u>
                {getName(notification.publication.by) ||
                  getHandle(notification.publication.by)}
              </u>{' '}
              mentions you
            </UserAction>
            <DateText>
              {dayjs(notification.publication.createdAt).fromNow()}
            </DateText>
          </UserActionWraper>
          <LensIcon />
        </NotificationItem>
      );
      break;
    default:
      return null;
  }
}

export const Wrapper = styled.div<{ open: boolean }>`
  z-index: 3;

  position: absolute;
  bottom: 20px;
  right: 0px;
  transform: translateX(100%);

  display: ${({ open }) => (open ? 'block' : 'none')};
`;
export const Body = styled.div`
  width: 400px;
  height: 760px;
  max-height: 80vh;
  padding: 20px;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;

  margin-left: 10px;
`;
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const Title = styled.h1`
  margin: 0;
  padding: 0;
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
export const NotificationListWraper = styled.div`
  width: 100%;
  height: 95%;
  margin-top: 20px;
  overflow: auto;
`;
export const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 0px;
  height: 70%;
  overflow: hidden;
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
  padding: 10px;
  &:hover {
    background-color: #39424c;
  }
  cursor: pointer;
  /* line-height: normal; */
  /* :first-child {
    flex-grow: 0;
    flex-shrink: 0;
  }
  :last-child {
    flex-grow: 0;
    flex-shrink: 0;
  } */
`;
const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-top: 6px;
  object-fit: cover;
`;
const UserActionWraper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 10px;
  width: 100%;
`;
const UserAction = styled.div`
  max-width: 100%;
  text-align: start;
  line-height: 24px;
`;
const PostText = styled.div`
  width: 250px;
  color: #718096;
  font-size: 16px;
  font-weight: 400;
  text-align: start;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  line-height: 24px;
`;
const DateText = styled.div`
  max-width: 100%;
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
