import { ComponentPropsWithRef, useEffect, useMemo } from 'react';
import ColorButton from '../common/button/ColorButton';
import { SocialPlatform } from '@/services/social/types';
import { useXmtpClient } from '@/contexts/message/XmtpClientCtx';
import useCanMessage from '@/hooks/message/xmtp/useCanMessage';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '@/utils/profile/biolink';
import { cn } from '@/lib/utils';
import NavigateToProfileLink from '../profile/info/NavigateToProfileLink';

export type MemberData = {
  handle: string;
  avatar: string;
  name: string;
  address: string;
  bio: string;
  platforms: SocialPlatform[];
  isFollowed: boolean;
};
export type MemberItemProps = ComponentPropsWithRef<'div'> & {
  data: MemberData;
  followPending?: boolean;
  unfollowPending?: boolean;
  followAction?: () => void;
  unfollowAction?: () => void;
};
export default function MemberItem({
  data,
  followPending,
  unfollowPending,
  followAction,
  unfollowAction,
  className,
  ...props
}: MemberItemProps) {
  const { setCanEnableXmtp } = useXmtpClient();
  useEffect(() => {
    setCanEnableXmtp(true);
  }, []);

  const { handle, avatar, name, address, bio, platforms, isFollowed } = data;
  const { canMessage } = useCanMessage(address);
  const { setMessageRouteParams } = useXmtpClient();

  const profileIdentity = useMemo(() => {
    if (handle.endsWith('.eth')) return handle;
    const firstPlatform = platforms?.[0];
    switch (firstPlatform) {
      case SocialPlatform.Lens:
        return lensHandleToBioLinkHandle(handle);
      case SocialPlatform.Farcaster:
        return farcasterHandleToBioLinkHandle(handle);
      default:
        return '';
    }
  }, [handle, platforms]);

  const profileUrl = useMemo(() => {
    if (profileIdentity) {
      return `/u/${profileIdentity}`;
    }
    return '';
  }, [profileIdentity]);
  return (
    <div
      className={cn(
        'flex px-[10px] py-[20px] box-border items-start gap-[10px] self-stretch max-sm:py-[10px]',
        className
      )}
      {...props}
    >
      <NavigateToProfileLink href={profileUrl}>
        <img
          src={avatar}
          alt=""
          className="w-[50px] h-[50px] rounded-[50%] max-sm:w-[40px] max-sm:h-[40px]"
        />
      </NavigateToProfileLink>

      <div className="flex-1 flex flex-col gap-[5px]">
        <div>
          <NavigateToProfileLink href={profileUrl}>
            <span className="text-[#FFF] text-[16px] font-medium">{name}</span>
          </NavigateToProfileLink>
        </div>

        <span className="text-[#718096] text-[12px] font-normal">{handle}</span>

        <span className="text-[#FFF] text-[16px] font-normal leading-[20px] break-all">
          {bio}
        </span>
      </div>
      <ColorButton
        className="bg-[#00D1A7] hover:bg-[#00D1A7] h-[30px] rounded-[20px] text-[12px] font-normal max-sm:h-[30px]"
        disabled={followPending || unfollowPending}
        onClick={() => {
          if (isFollowed) {
            unfollowAction?.();
          } else {
            followAction?.();
          }
        }}
      >
        {(() => {
          if (followPending) {
            return 'Following';
          }
          if (unfollowPending) {
            return 'Unfollowing';
          }
          if (isFollowed) {
            return 'Following';
          }
          return 'Follow';
        })()}
      </ColorButton>
    </div>
  );
}
