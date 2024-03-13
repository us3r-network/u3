import { useNavigate } from 'react-router-dom';
import { ReactionType } from '@farcaster/hub-web';
import { useMemo } from 'react';
import { FarcasterNotification } from '@/services/social/api/farcaster';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import NotificationItem, {
  NotificationActionType,
} from '../ui/NotificationItem';
import { NotificationType as FarcasterNotificationType } from '@/services/notification/types/notifications';

interface FarcasterNotificationItemProps {
  notification: FarcasterNotification;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
}
export default function FarcasterNotificationItem({
  notification,
  farcasterUserData,
}: FarcasterNotificationItemProps) {
  const navigate = useNavigate();
  const userData = useFarcasterUserData({
    fid: String(notification.message_fid),
    farcasterUserData,
  });

  const viewData = useMemo(() => {
    let actionType: NotificationActionType;
    switch (notification.type) {
      case FarcasterNotificationType.REPLY:
        actionType = NotificationActionType.comment;
        break;
      case FarcasterNotificationType.REACTION:
        switch (notification.reactions_type) {
          case ReactionType.LIKE:
            actionType = NotificationActionType.like;
            break;
          case ReactionType.RECAST:
            actionType = NotificationActionType.repost;
            break;
          default:
            break;
        }
        break;
      case FarcasterNotificationType.FOLLOW:
        actionType = NotificationActionType.follow;
        break;
      case FarcasterNotificationType.MENTION:
        actionType = NotificationActionType.mention;
        break;
      default:
        break;
    }
    return {
      actionType,
      userName: userData.userName,
      userAvatar: userData.pfp,
      timeStamp: notification.message_timestamp,
      text: notification.replies_text || notification.casts_text,
    };
  }, [notification, userData]);

  const clickAction = () => {
    console.log('notification', notification);
    switch (notification.type) {
      case FarcasterNotificationType.REPLY:
        navigate(
          `/social/post-detail/fcast/${Buffer.from(
            notification.replies_parent_hash
          ).toString('hex')}#${Buffer.from(notification.replies_hash).toString(
            'hex'
          )}`
        );
        break;
      case FarcasterNotificationType.REACTION:
        switch (notification.reactions_type) {
          case ReactionType.LIKE:
          case ReactionType.RECAST:
            navigate(
              `/social/post-detail/fcast/${Buffer.from(
                notification.casts_hash
              ).toString('hex')}`
            );
            break;
          default:
            break;
        }
        break;
      case FarcasterNotificationType.MENTION:
        navigate(
          `/social/post-detail/fcast/${Buffer.from(
            notification.casts_hash
          ).toString('hex')}#${Buffer.from(notification.casts_hash).toString(
            'hex'
          )}`
        );
        break;
      case FarcasterNotificationType.FOLLOW:
        navigate('/u/contacts?type=follower');
        break;
      default:
        break;
    }
  };
  if (!viewData?.actionType) return null;
  return <NotificationItem data={viewData} onClick={clickAction} />;
}
