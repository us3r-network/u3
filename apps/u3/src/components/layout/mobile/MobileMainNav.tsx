/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-22 16:03:33
 * @Description: file description
 */

import { ComponentPropsWithRef } from 'react';
import useRoute from '../../../route/useRoute';
import { RouteKey } from '../../../route/routes';
import NavLinkItem, { NavLinkItemProps } from '../NavLinkItem';
import CommunityIcon from '../nav-icons/CommunityIcon';
import { cn } from '@/lib/utils';
import NotificationIcon from '../nav-icons/NotificationIcon';
import MessageIcon from '../nav-icons/MessageIcon';
import ExploreIcon from '../nav-icons/ExploreIcon';
import FavIcon from '../nav-icons/FavIcon';

export default function MobileMainNav({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const { firstRouteMeta, lastRouteMeta } = useRoute();

  const firstRouteKey = firstRouteMeta?.key;
  const lastRouteKey = lastRouteMeta?.key;

  const isCommunitiesRoute = [
    RouteKey.communities,
    RouteKey.trendingCommunities,
    RouteKey.newestCommunities,
    RouteKey.joinedCommunities,
  ].includes(lastRouteKey);

  const isExploreRoute = firstRouteKey === RouteKey.home && !isCommunitiesRoute;

  const isCommunityRoute =
    isCommunitiesRoute || firstRouteKey === RouteKey.community;

  const isMessageRoute = firstRouteKey === RouteKey.message;
  const isNotificationRoute = firstRouteKey === RouteKey.notification;
  const isFavRoute = firstRouteKey === RouteKey.fav;
  return (
    <div
      className={cn(
        'fixed bottom-[0] w-screen h-[80px] px-[10px] py-[20px] box-border bg-[#14171A] flex justify-between items-center z-10',
        'hidden max-sm:flex',
        className
      )}
      {...props}
    >
      <MobileNavItem href="/" active={isExploreRoute}>
        <ExploreIcon active={isExploreRoute} />
        Explore
      </MobileNavItem>
      <MobileNavItem href="/communities" active={isCommunityRoute}>
        <CommunityIcon active={isCommunityRoute} />
        Communities
      </MobileNavItem>
      <MobileNavItem href="/notification" active={isNotificationRoute}>
        <NotificationIcon active={isNotificationRoute} />
        Notification
      </MobileNavItem>
      <MobileNavItem active={isMessageRoute} href="/message">
        <MessageIcon active={isMessageRoute} />
        Message
      </MobileNavItem>
      <MobileNavItem href="/fav/posts" active={isFavRoute}>
        <FavIcon active={isFavRoute} />
        Favorites
      </MobileNavItem>
    </div>
  );
}

function MobileNavItem({ active, className, ...props }: NavLinkItemProps) {
  return (
    <NavLinkItem
      className={cn(
        'flex-col gap-[4px] text-[10px] p-0 bg-transparent hover:bg-transparent  max-sm:text-[10px]',
        active && 'bg-transparent text-[#FFF]',
        className
      )}
      {...props}
    />
  );
}
