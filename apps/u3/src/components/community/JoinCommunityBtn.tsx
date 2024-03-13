import { ComponentPropsWithRef } from 'react';
import { CommunityInfo } from '@/services/community/types/community';
import ColorButton from '../common/button/ColorButton';
import { cn } from '@/lib/utils';
import useJoinCommunityAction from '@/hooks/community/useJoinCommunityAction';
import useLogin from '@/hooks/shared/useLogin';

export default function JoinCommunityBtn({
  className,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'button'> & {
  communityInfo: CommunityInfo;
}) {
  const { isLogin, login } = useLogin();
  const {
    joiningAction,
    unjoiningAction,
    validateJoinActionIsDisabled,
    validateJoinActionIsPending,
    validateJoined,
  } = useJoinCommunityAction();
  return (
    <ColorButton
      className={cn('h-[30px]', className)}
      disabled={validateJoinActionIsDisabled(communityInfo.id)}
      onClick={() => {
        if (!isLogin) {
          login();
          return;
        }
        if (validateJoined(communityInfo.id)) {
          unjoiningAction(communityInfo.id);
        } else {
          joiningAction(communityInfo.id, communityInfo);
        }
      }}
      {...props}
    >
      {(() => {
        if (validateJoined(communityInfo.id)) {
          if (validateJoinActionIsPending(communityInfo.id)) {
            return 'Unjoining...';
          }
          return 'Unjoin';
        }
        if (validateJoinActionIsPending(communityInfo.id)) {
          return 'Joining...';
        }
        return 'Join';
      })()}
    </ColorButton>
  );
}
