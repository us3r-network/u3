import { useNavigate } from 'react-router-dom';
import { CommunityInfo } from '@/services/community/types/community';
import { getCommunityPath } from '@/route/path';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardArrow,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import CommunityInfoAndAction from './CommunityInfoAndAction';

export default function SidebarCommunityItem({
  communityInfo,
  active,
}: {
  communityInfo: CommunityInfo;
  active?: boolean;
}) {
  const navigate = useNavigate();
  const url = getCommunityPath(communityInfo.channelId);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={url}
          onClick={(e) => {
            e.preventDefault();
            navigate(url);
          }}
          className="w-full flex justify-center items-center cursor-pointer relative"
        >
          <div
            className={cn(
              'w-[5px] h-[40px] rounded-tl-none rounded-br-[10px] rounded-tr-[10px] rounded-bl-none bg-[#FFF] absolute left-0',
              'transition-all duration-300',
              active ? 'block' : 'hidden'
            )}
          />
          <img
            src={communityInfo.logo}
            alt={communityInfo.name}
            className="rounded-md w-[40px] h-[40px]"
          />
        </a>
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        className="w-[280px] h-auto bg-[#14171A] border-none"
      >
        <HoverCardArrow className="w-[30px] h-[10px] fill-[#14171A]" />
        <CommunityInfoAndAction communityInfo={communityInfo} />
      </HoverCardContent>
    </HoverCard>
  );
}
