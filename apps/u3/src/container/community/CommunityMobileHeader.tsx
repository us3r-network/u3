import { ComponentPropsWithRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CommunityInfo } from '@/services/community/types/community';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MobileHeaderWrapper } from '@/components/layout/mobile/MobileHeaderCommon';
import SearchIconBtn from '@/components/layout/SearchIconBtn';
import AddPostMobileBtn from '@/components/social/AddPostMobileBtn';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import getCommunityNavs from '@/utils/community/getCommunityNavs';
import CommunityInfoAndAction from '@/components/community/CommunityInfoAndAction';
import LoginButtonV2Mobile from '@/components/layout/LoginButtonV2Mobile';

export default function CommunityMobileHeader({
  className,
  communityInfo,
  channelId,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
  channelId: string;
}) {
  const navigate = useNavigate();
  const { mainNavs } = getCommunityNavs(channelId, communityInfo);
  const { pathname } = useLocation();
  const findHref = mainNavs?.find((nav) => pathname.includes(nav.href))?.href;
  return (
    <MobileHeaderWrapper
      className={cn('bg-[#20262F] border-b border-[#39424C]', className)}
      {...props}
    >
      <Select
        onValueChange={(href) => {
          navigate(href);
        }}
        defaultValue={findHref}
      >
        <SelectTrigger className="w-auto border-none rounded-[10px] bg-[#1B1E23] text-[#FFF] text-[14px] font-medium outline-none focus:outline-none focus:border-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="mr-[10px]"
          >
            <path
              d="M1.95692 1.97998H18.2685C18.6975 1.97998 19.0453 2.32776 19.0453 2.75672C19.0453 3.18566 18.6975 3.53344 18.2685 3.53344H1.95692C1.52796 3.53346 1.18018 3.18566 1.18018 2.75672C1.18018 2.32776 1.52796 1.97998 1.95692 1.97998ZM1.95692 8.19392H18.2685C18.6975 8.19392 19.0453 8.54172 19.0453 8.97066C19.0453 9.39962 18.6975 9.7474 18.2685 9.7474H1.95692C1.52796 9.7474 1.18018 9.3996 1.18018 8.97066C1.18018 8.54172 1.52796 8.19392 1.95692 8.19392ZM1.95692 14.4079H18.2685C18.6975 14.4079 19.0453 14.7556 19.0453 15.1846C19.0453 15.6135 18.6975 15.9613 18.2685 15.9613H1.95692C1.52796 15.9613 1.18018 15.6135 1.18018 15.1846C1.18018 14.7556 1.52796 14.4079 1.95692 14.4079Z"
              fill="white"
            />
          </svg>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[10px] bg-[#1B1E23] text-[#FFF] text-[14px] font-medium border-none">
          {mainNavs.map((nav) => {
            return (
              <SelectItem
                key={nav.href}
                value={nav.href}
                className="hover:bg-[#20262F]"
              >
                {nav.title}
              </SelectItem>
            );
          })}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                type="button"
                className="hover:bg-[#20262F] w-full text-start py-1.5 pl-2 pr-8"
              >
                Info
              </button>
            </DrawerTrigger>
            <DrawerContent className="rounded-tl-[20px] rounded-br-none rounded-tr-[20px] rounded-bl-none bg-[#20262F] border-none outline-none p-[20px]">
              <CommunityInfoAndAction communityInfo={communityInfo} />
            </DrawerContent>
          </Drawer>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-[20px]">
        <SearchIconBtn />
        <LoginButtonV2Mobile />
        <AddPostMobileBtn />
      </div>
    </MobileHeaderWrapper>
  );
}
