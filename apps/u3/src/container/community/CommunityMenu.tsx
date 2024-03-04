import { ComponentPropsWithRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CommunityInfo } from '@/services/community/types/community';
import AddPost from '@/components/social/AddPost';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';
import {
  getCommunityAppPath,
  getCommunityNftPath,
  getCommunityPointPath,
  getCommunityPostsPath,
  getCommunityTokenPath,
} from '@/route/path';
import NavLinkItem from '@/components/layout/NavLinkItem';
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
import CommunityBaseInfo from '@/components/community/CommunityBaseInfo';

export default function CommunityMenu({
  className,
  communityInfo,
  channelId,
  joined,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
  channelId: string;
  joined: boolean;
}) {
  const navigate = useNavigate();
  const { nfts, tokens, points, apps } = communityInfo || {};
  const { pathname } = useLocation();
  const mainNavs = [
    { title: 'Posts', href: getCommunityPostsPath(channelId) },
    // { title: 'Members', href: `/community/${channelId}/members` },
  ];
  const nft = nfts?.length > 0 ? nfts[0] : null;
  if (nft) {
    mainNavs.push({
      title: 'NFT',
      href: getCommunityNftPath(channelId, nft?.contract),
    });
  }

  const token = tokens?.length > 0 ? tokens[0] : null;
  if (token) {
    mainNavs.push({
      title: 'Token',
      href: getCommunityTokenPath(channelId, token?.contract),
    });
  }

  const point = points?.length > 0 ? points[0] : null;
  if (point) {
    mainNavs.push({
      title: 'Points',
      href: getCommunityPointPath(channelId),
    });
  }

  const dappNavs = apps?.map((dapp) => {
    return {
      title: dapp.name,
      href: getCommunityAppPath(channelId, dapp.name),
      icon: dapp.logo,
    };
  });
  return (
    <div
      className={cn(
        `w-[280px] h-full`,
        'max-sm:w-full max-sm:h-[56px]',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          `w-full h-full flex flex-col bg-[#1B1E23]`,
          'max-sm:hidden',
          className
        )}
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
      <MobileHeaderWrapper className="bg-[#20262F] border-b border-[#39424C]">
        <Select
          onValueChange={(href) => {
            navigate(href);
          }}
          defaultValue={mainNavs[0]?.href}
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
          </SelectContent>
        </Select>
        <div className="flex items-center gap-[20px]">
          <SearchIconBtn />
          <AddPostMobileBtn />
        </div>
      </MobileHeaderWrapper>
    </div>
  );
}
