import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityInfo } from '@/services/community/types/community';
import { cn } from '@/lib/utils';
import JoinCommunityBtn from './JoinCommunityBtn';

export default function CommunityItem({
  className,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
}) {
  const navigate = useNavigate();
  const { logo, name, description, memberInfo, types } = communityInfo || {};
  return (
    <div
      className={cn(
        'h-[160px] flex p-[20px] box-border items-center gap-[20px] bg-[#1B1E23] rounded-[20px] cursor-pointer',
        'max-sm:p-[10px] max-sm:h-[120px]',
        className
      )}
      onClick={() => {
        navigate(`/community/${communityInfo.channelId}`);
      }}
      {...props}
    >
      <img
        src={logo}
        alt=""
        className="w-[120px] h-[120px] rounded-[20px] max-sm:w-[100px] max-sm:h-[100px]"
      />
      <div className="flex-1 flex h-full flex-col justify-between items-start">
        <div className="w-full flex justify-between items-start gap-[10px]">
          <div className="flex-1 flex flex-col gap-[10px]">
            {types?.length > 0 && (
              <div className="text-[#718096] text-[12px] font-normal line-clamp-1">
                {types.reduce((acc, cur) => {
                  return `${acc}, ${cur}`;
                })}
              </div>
            )}
            <div className="text-[#FFF] text-[16px] font-medium">{name}</div>
          </div>
          <JoinCommunityBtn communityInfo={communityInfo} />
        </div>
        <div className="flex gap-[10px] items-center">
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
        <div className="text-[#FFF] text-[14px] font-normal leading-[20px] line-clamp-2">
          {description}
        </div>
      </div>
    </div>
  );
}
