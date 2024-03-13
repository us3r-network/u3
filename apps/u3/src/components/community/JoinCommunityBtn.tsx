import { ComponentPropsWithRef } from 'react';
import { CommunityInfo } from '@/services/community/types/community';
import ColorButton from '../common/button/ColorButton';
import { cn } from '@/lib/utils';
import useJoinCommunityAction from '@/hooks/community/useJoinCommunityAction';

export default function JoinCommunityBtn({
  className,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'button'> & {
  communityInfo: CommunityInfo;
}) {
  const { joined, isPending, isDisabled, joinChangeAction } =
    useJoinCommunityAction(communityInfo);
  return (
    <ColorButton
      className={cn(
        'px-[12px] min-w-[48px] h-[30px] py-[8px] box-border gap-[20px] rounded-[20px] bg-[#F41F4C] text-[#FFF] text-[12px] font-normal',
        className
      )}
      disabled={isDisabled}
      onClick={(e) => {
        e.stopPropagation();
        joinChangeAction();
      }}
      {...props}
    >
      {(() => {
        if (joined) {
          if (isPending) {
            return 'Unjoining...';
          }
          return 'Joined';
        }
        if (isPending) {
          return 'Joining...';
        }
        return 'Join';
      })()}
    </ColorButton>
  );
}
