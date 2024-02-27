import { ComponentPropsWithRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const { logo, name, description, memberInfo, nfts, tokens, points, apps } =
    communityInfo || {};
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
        `
        w-full h-full flex flex-col bg-[#1B1E23]`,
        className
      )}
      {...props}
    >
      <div className="flex-1 w-full p-[20px] box-border overflow-auto">
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
  );
}
