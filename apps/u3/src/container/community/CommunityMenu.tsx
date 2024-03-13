import { ComponentPropsWithRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CommunityInfo } from '@/services/community/types/community';
import AddPost from '@/components/social/AddPost';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';
import NavLinkItem from '@/components/layout/NavLinkItem';
import CommunityBaseInfo from '@/components/community/CommunityBaseInfo';
import getCommunityNavs from '@/utils/community/getCommunityNavs';
import { isCommunityLinksPath } from '@/route/path';
import useJoinCommunityAction from '@/hooks/community/useJoinCommunityAction';

export default function CommunityMenu({
  className,
  communityInfo,
  channelId,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
  channelId: string;
}) {
  const { pathname } = useLocation();
  const { mainNavs, dappNavs } = getCommunityNavs(channelId, communityInfo);
  const { joined } = useJoinCommunityAction(communityInfo);
  return (
    <div
      className={cn(`w-[280px] h-full flex flex-col bg-[#1B1E23]`, className)}
      {...props}
    >
      <div className="flex-1 w-full p-[20px] box-border overflow-auto">
        <CommunityBaseInfo communityInfo={communityInfo} />

        <AddPost
          className={cn(
            'h-[40px] mt-[20px] rounded-[12px] ',
            !joined && `bg-[#F41F4C] hover:bg-[#F41F4C]`
          )}
        />

        <div className="w-full h-[1px] bg-[#39424C] mt-[20px] mb-[20px]" />
        <div className="w-full flex flex-col gap-[5px]">
          {mainNavs.map((nav) => {
            if (isCommunityLinksPath(nav.href)) {
              return null;
            }
            return (
              <NavLinkItem
                key={nav.href}
                href={nav.href}
                active={pathname.includes(nav.href)}
              >
                {nav.title}
              </NavLinkItem>
            );
          })}
        </div>

        <div className="w-full h-[1px] bg-[#39424C] mt-[20px] mb-[20px]" />
        <div className="w-full flex flex-col  gap-[5px]">
          <span className="text-[#718096] text-[16px] font-medium mb-[10px]">
            Community DApps
          </span>
          {dappNavs.map((nav) => {
            return (
              <NavLinkItem
                key={nav.href}
                href={nav.href}
                active={pathname.includes(nav.href)}
                className="flex items-center gap-[10px]"
              >
                <img src={nav.icon} alt="" className="w-[24px] h-[24px]" />
                {nav.title}
              </NavLinkItem>
            );
          })}
        </div>
      </div>
      <LoginButtonV2 />
    </div>
  );
}
