import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export enum NotificationActionType {
  comment = 'comment',
  like = 'like',
  repost = 'repost',
  follow = 'follow',
  mention = 'mention',
}
const getActionTypeTitle = (actionType: NotificationActionType) => {
  switch (actionType) {
    case NotificationActionType.comment:
      return 'comment on your post';
    case NotificationActionType.like:
      return 'liked your post';
    case NotificationActionType.repost:
      return 'repost your post';
    case NotificationActionType.follow:
      return 'followed you';
    case NotificationActionType.mention:
      return 'mentioned you';
    default:
      return '';
  }
};
type NotificationData = {
  actionType: NotificationActionType;
  userName: string;
  userAvatar?: string;
  text?: string;
};
interface NotificationItemProps extends ComponentPropsWithRef<'div'> {
  data: NotificationData;
}
export default function NotificationItem({
  data,
  className,
  ...divProps
}: NotificationItemProps) {
  const { actionType, userName, userAvatar, text } = data;
  return (
    <div
      className={cn(
        'flex items-center gap-[20px] py-[20px] border-b-[1px] border-solid border-[#39424C]',
        className
      )}
      {...divProps}
    >
      <ActionTypeStyled actionType={actionType} userAvatar={userAvatar} />
      <div className="w-0 flex-1 flex flex-col gap-[15px] text-start leading-normal">
        <span className="text-white font-[Roboto] text-[16px] font-normal">
          <span className="underline">{userName}</span>
          <span className="ml-[5px]">{getActionTypeTitle(actionType)}</span>
        </span>
        {text?.trim() && (
          <span className="text-[#718096] font-[Roboto] text-[12px] font-normal line-clamp-1">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

function ActionTypeStyled({
  actionType,
  userAvatar,
}: {
  actionType: NotificationActionType;
  userAvatar?: string;
}) {
  if (
    [NotificationActionType.follow, NotificationActionType.mention].includes(
      actionType
    )
  ) {
    return (
      <img
        className="w-[40px] h-[40px] rounded-[30px] shrink-0"
        src={userAvatar}
        alt=""
      />
    );
  }
  let icon: JSX.Element;
  switch (actionType) {
    case NotificationActionType.comment:
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M2 5.2C2 4.07989 2 3.51984 2.21799 3.09202C2.40973 2.71569 2.71569 2.40973 3.09202 2.21799C3.51984 2 4.0799 2 5.2 2H10.8C11.9201 2 12.4802 2 12.908 2.21799C13.2843 2.40973 13.5903 2.71569 13.782 3.09202C14 3.51984 14 4.07989 14 5.2V9C14 9.93188 14 10.3978 13.8478 10.7654C13.6448 11.2554 13.2554 11.6448 12.7654 11.8478C12.3978 12 11.9319 12 11 12C10.6743 12 10.5114 12 10.3603 12.0357C10.1589 12.0832 9.97126 12.177 9.81234 12.3097C9.69315 12.4091 9.59543 12.5394 9.4 12.8L8.42667 14.0978C8.28192 14.2908 8.20955 14.3873 8.12082 14.4218C8.04311 14.452 7.95689 14.452 7.87918 14.4218C7.79045 14.3873 7.71808 14.2908 7.57333 14.0978L6.6 12.8C6.40457 12.5394 6.30685 12.4091 6.18766 12.3097C6.02874 12.177 5.84113 12.0832 5.63967 12.0357C5.48858 12 5.32572 12 5 12C4.06812 12 3.60218 12 3.23463 11.8478C2.74458 11.6448 2.35523 11.2554 2.15224 10.7654C2 10.3978 2 9.93188 2 9V5.2Z"
            stroke="#718096"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    case NotificationActionType.like:
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M16 5.21086C16 6.58551 15.525 7.90587 14.6766 8.88258C12.7239 11.1316 10.8299 13.4767 8.80424 15.6442C8.33992 16.1338 7.60336 16.1159 7.15904 15.6042L1.32301 8.88258C-0.441002 6.85085 -0.441002 3.57087 1.32301 1.53917C3.10435 -0.512489 6.00635 -0.512489 7.78768 1.53917C7.89963 1.66809 8.0999 1.66824 8.21184 1.53932C9.06592 0.555111 10.2291 0 11.4442 0C12.6594 0 13.8225 0.555058 14.6766 1.53917C15.525 2.51596 16 3.83624 16 5.21086Z"
            fill="#F81775"
          />
        </svg>
      );
      break;
    case NotificationActionType.repost:
      icon = (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M11.3333 1.33331L14 3.99998M14 3.99998L11.3333 6.66665M14 3.99998H5.2C4.0799 3.99998 3.51984 3.99998 3.09202 4.21797C2.71569 4.40971 2.40973 4.71567 2.21799 5.092C2 5.51982 2 6.07987 2 7.19998V7.33331M2 12H10.8C11.9201 12 12.4802 12 12.908 11.782C13.2843 11.5902 13.5903 11.2843 13.782 10.908C14 10.4801 14 9.92008 14 8.79998V8.66665M2 12L4.66667 14.6666M2 12L4.66667 9.33331"
            stroke="#718096"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
      break;
    default:
      icon = <span>-</span>;
      break;
  }
  return (
    <div className="w-[40px] h-[40px] rounded-[10px] border-[1px] border-solid border-[#39424C] flex justify-center items-center">
      {icon}
    </div>
  );
}
