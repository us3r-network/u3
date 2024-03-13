import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommunityInfo } from '@/services/community/types/community';
import { cn } from '@/lib/utils';
import JoinCommunityBtn from './JoinCommunityBtn';

export default function GrowingCommunityItem({
  className,
  ranking,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'div'> & {
  ranking: number;
  communityInfo: CommunityInfo;
}) {
  const navigate = useNavigate();
  const { logo, name, memberInfo } = communityInfo || {};
  return (
    <div
      className={cn(
        'w-full h-[50px] flex items-center gap-[10px] bg-[#1B1E23] cursor-pointer',
        className
      )}
      onClick={() => {
        navigate(`/community/${communityInfo.channelId}`);
      }}
      {...props}
    >
      <div className="w-[50px] flex justify-between items-center gap-[5px]">
        <span className="text-[#FFF] text-[12px] font-normal">{ranking}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M3.79126 12.1326H16.8599L10.3256 4.91549L3.79126 12.1326Z"
            fill="#F41F4C"
          />
        </svg>
      </div>

      <div className="flex-1 flex items-center gap-[10px]">
        <img src={logo} alt="" className="w-[50px] h-[50px] rounded-[10px]" />
        <div className="flex-1 flex flex-col justify-center items-start gap-[10px]">
          <div className="text-[#FFF] text-[16px] font-medium line-clamp-1">
            {name}
          </div>
          <div className="text-[#00D1A7] text-[12px] font-normal line-clamp-1">
            {memberInfo?.totalNumber || 0} members
          </div>
        </div>
      </div>

      <JoinCommunityBtn communityInfo={communityInfo} />
    </div>
  );
}
