import { useNavigate } from 'react-router-dom';
import { MessageType, ReactionType } from '@farcaster/hub-web';
import { useMemo } from 'react';
import { FarcasterNotification } from '@/services/social/api/farcaster';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import NotificationItem, {
  NotificationActionType,
} from '../ui/NotificationItem';

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
    switch (notification.message_type) {
      case MessageType.CAST_ADD:
        actionType = NotificationActionType.comment;
        break;
      case MessageType.REACTION_ADD:
        switch (notification.reaction_type) {
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
      case MessageType.LINK_ADD:
        actionType = NotificationActionType.follow;
        break;
      default:
        break;
    }
    return {
      actionType,
      userName: userData.userName,
      userAvatar: userData.pfp,
      text: notification.text,
    };
  }, [notification, userData]);

  const clickAction = () => {
    switch (notification.message_type) {
      case MessageType.CAST_ADD:
        navigate(
          `/social/post-detail/fcast/${Buffer.from(
            notification.parent_hash
          ).toString('hex')}#${Buffer.from(notification.hash).toString('hex')}`
        );
        break;
      case MessageType.REACTION_ADD:
        switch (notification.reaction_type) {
          case ReactionType.LIKE:
          case ReactionType.RECAST:
            navigate(
              `/social/post-detail/fcast/${Buffer.from(
                notification.hash
              ).toString('hex')}`
            );
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
  if (!viewData?.actionType) return null;
  return <NotificationItem data={viewData} onClick={clickAction} />;
}
