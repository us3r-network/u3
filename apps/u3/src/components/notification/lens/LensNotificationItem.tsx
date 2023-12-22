/* eslint-disable no-underscore-dangle */
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Notification } from '@lens-protocol/react-web';
import NotificationItem, {
  NotificationActionType,
} from '../ui/NotificationItem';
import { getHandle, getName } from '@/utils/social/lens/profile';
import getAvatar from '@/utils/social/lens/getAvatar';
import getContent from '@/utils/social/lens/getContent';

interface LensNotificationItemProps {
  notification: Notification;
}

enum LensNotificationType {
  NEW_FOLLOWER = 'FollowNotification',
  NEW_COMMENT = 'CommentNotification',
  NEW_MIRROR = 'MirrorNotification',
  NEW_MENTION = 'MentionNotification',
  NEW_REACTION = 'ReactionNotification',
}
export default function LensNotificationItem({
  notification,
}: LensNotificationItemProps) {
  const navigate = useNavigate();

  const viewData = useMemo(() => {
    switch (notification.__typename) {
      case LensNotificationType.NEW_COMMENT:
        return {
          actionType: NotificationActionType.comment,
          userName:
            getName(notification.comment.by) ||
            getHandle(notification.comment.by),
          userAvatar: getAvatar(notification.comment.by),
          text: getContent(notification.comment.metadata),
        };
      case LensNotificationType.NEW_REACTION:
        return {
          actionType: NotificationActionType.like,
          userName:
            getName(notification.reactions[0].profile) ||
            getHandle(notification.reactions[0].profile),
          userAvatar: getAvatar(notification.reactions[0].profile),
          text: getContent(notification.publication.metadata),
        };
      case LensNotificationType.NEW_MIRROR:
        return {
          actionType: NotificationActionType.repost,
          userName:
            getName(notification.mirrors[0].profile) ||
            getHandle(notification.mirrors[0].profile),
          userAvatar: getAvatar(notification.mirrors[0].profile),
          text: getContent(notification.publication.metadata),
        };
      case LensNotificationType.NEW_FOLLOWER:
        return {
          actionType: NotificationActionType.follow,
          userName:
            getName(notification.followers[0]) ||
            getHandle(notification.followers[0]),
          userAvatar: getAvatar(notification.followers[0]),
        };
      case LensNotificationType.NEW_MENTION:
        return {
          actionType: NotificationActionType.mention,
          userName:
            getName(notification.publication.by) ||
            getHandle(notification.publication.by),
          userAvatar: getAvatar(notification.publication.by),
          text: getContent(notification.publication.metadata),
        };
      default:
        return null;
    }
  }, [notification]);

  const clickAction = () => {
    switch (notification.__typename) {
      case LensNotificationType.NEW_COMMENT:
        navigate(
          `/social/post-detail/lens/${notification?.comment?.commentOn?.id}#${notification?.comment?.id}`
        );
        break;
      case LensNotificationType.NEW_REACTION:
        navigate(`/social/post-detail/lens/${notification.publication.id}`);
        break;
      case LensNotificationType.NEW_MIRROR:
        navigate(`/social/post-detail/lens/${notification.publication.id}`);
        break;
      case LensNotificationType.NEW_FOLLOWER:
        break;
      case LensNotificationType.NEW_MENTION:
        break;
      default:
        break;
    }
  };
  if (!viewData?.actionType) return null;
  return <NotificationItem data={viewData} onClick={clickAction} />;
}
