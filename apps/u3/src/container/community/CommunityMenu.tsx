import { ComponentPropsWithRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { CommunityInfo } from '@/services/community/types/community';
import AddPost from '@/components/social/AddPost';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';

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
    { title: 'Posts', href: `/community/${channelId}/posts` },
    // { title: 'Members', href: `/community/${channelId}/members` },
  ];
  const nft = nfts?.length > 0 ? nfts[0] : null;
  if (nft) {
    mainNavs.push({
      title: 'NFT',
      href: `/community/${channelId}/nft/${nft?.contract}`,
    });
  }

  const token = tokens?.length > 0 ? tokens[0] : null;
  if (token) {
    mainNavs.push({
      title: 'Token',
      href: `/community/${channelId}/token/${token?.contract}`,
    });
  }

  const point = points?.length > 0 ? points[0] : null;
  if (point) {
    mainNavs.push({
      title: 'Points',
      href: `/community/${channelId}/point`,
    });
  }

  const dappNavs = apps?.map((dapp) => {
    return {
      title: dapp.name,
      href: `/community/${channelId}/app/${dapp.name}`,
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
      <div className="h-[76px] w-full p-[20px] box-border bg-[#14171A] text-[#FFF] text-[16px] font-normal">
        <LoginButtonV2 />
      </div>
    </div>
  );
}

function NavLinkItem({
  active,
  href,
  className,
  children,
  ...props
}: ComponentPropsWithRef<'a'> & {
  active?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      className={cn(
        `block w-full h-[40px] p-[10px] box-border select-none rounded-[10px] leading-none no-underline outline-none transition-colors
         text-[#718096] text-[16px] font-medium`,
        `hover:bg-[#20262F] focus:bg-[#20262F] active:bg-[#20262F]`,
        active && 'bg-[#20262F] text-[#FFF]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
