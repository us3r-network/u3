import { ComponentPropsWithRef } from 'react';
import { CommunityInfo } from '@/services/community/types/community';
import CommunityBaseInfo from './CommunityBaseInfo';
import { JoinCommunityTextBtn } from './JoinCommunityBtn';
import { cn } from '@/lib/utils';

export default function CommunityInfoAndAction({
  className,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
}) {
  return (
    <div
      className={cn(`w-full box-border flex flex-col gap-[20px]`, className)}
      {...props}
    >
      <CommunityBaseInfo communityInfo={communityInfo} />
      <hr className="border-[#39424C]" />
      <div>
        <JoinCommunityTextBtn communityInfo={communityInfo} />
      </div>
    </div>
  );
}
