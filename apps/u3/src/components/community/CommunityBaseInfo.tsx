import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';
import type { CommunityInfo } from '@/services/community/types/community';

export default function CommunityBaseInfo({
  className,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
}) {
  const { logo, name, description, memberInfo } = communityInfo || {};
  return (
    <div
      className={cn(`w-full box-border overflow-auto`, className)}
      {...props}
    >
      <div className="flex gap-[10px] items-center ">
        <img src={logo} alt="" className="w-[50px] h-[50px] rounded-[4px]" />
        <div className="flex flex-col gap-[5px]">
          {communityInfo?.types?.length > 0 && (
            <div className="text-[#718096] text-[12px] font-normal line-clamp-1">
              {communityInfo?.types.reduce((acc, cur) => {
                return `${acc}, ${cur}`;
              })}
            </div>
          )}

          <div className="text-[#FFF] text-[16px] font-medium">{name}</div>
        </div>
      </div>
      <div className="text-[#FFF] text-[14px] font-normal leading-[20px] mt-[20px]">
        {description}
      </div>
      <div className="flex gap-[10px] items-center  mt-[20px]">
        {memberInfo?.newPostNumber > 0 && (
          <div className="text-[#718096] text-[12px] font-normal leading-[15px]">
            {memberInfo?.newPostNumber} new posts
          </div>
        )}
        {memberInfo?.totalNumber > 0 && (
          <div className="text-[#718096] text-[12px] font-normal leading-[15px]">
            {memberInfo?.totalNumber} members
          </div>
        )}
      </div>
      {memberInfo?.friendMemberNumber > 0 && (
        <div className="text-[#718096] text-[12px] font-normal leading-[15px] mt-[20px]">
          {memberInfo?.friendMemberNumber} of your friends are members
        </div>
      )}
    </div>
  );
}
