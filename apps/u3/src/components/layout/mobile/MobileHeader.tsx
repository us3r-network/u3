/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useRoute from '../../../route/useRoute';
import { RouteKey } from '../../../route/routes';
import { cn } from '@/lib/utils';
import { MobileHeaderBackBtn, MobileHeaderWrapper } from './MobileHeaderCommon';
import SearchIconBtn from '../SearchIconBtn';
import AddPostMobileBtn from '@/components/social/AddPostMobileBtn';
// import MobileDappHeader from './MobileDappHeader';
// import MobileContentHeader from './MobileContentHeader';

export default function MobileHeader({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const navigate = useNavigate();
  const { firstRouteMeta, lastRouteMeta } = useRoute();
  const firstRouteKey = firstRouteMeta?.key;
  const lastRouteKey = lastRouteMeta?.key;
  console.log(firstRouteMeta, lastRouteMeta);

  const isHomeRoute =
    firstRouteKey === RouteKey.home && lastRouteKey !== RouteKey.communities;

  const isCommunityRoute = firstRouteKey === RouteKey.community;

  const isCommunitiesRoute = lastRouteKey === RouteKey.communities;

  const isExplorePostsRoute = false;
  const isMessageRoute = false;
  const isNotificationRoute = false;

  if (isCommunityRoute) {
    return null;
  }
  if (isHomeRoute) {
    return (
      <MobileHeaderWrapper>
        <div
          className="text-[#FFF] text-[16px] font-medium"
          onClick={() => navigate('/')}
        >
          Explore
        </div>
        <div className="flex items-center gap-[20px]">
          <SearchIconBtn />
        </div>
      </MobileHeaderWrapper>
    );
  }
  if (isCommunitiesRoute) {
    return (
      <MobileHeaderWrapper>
        <MobileHeaderBackBtn title="Communities" />
        <div className="flex items-center gap-[20px]">
          <SearchIconBtn />
        </div>
      </MobileHeaderWrapper>
    );
  }
  if (isExplorePostsRoute) {
    return (
      <MobileHeaderWrapper>
        <MobileHeaderBackBtn title="Posts" />
        <div className="flex items-center gap-[20px]">
          <SearchIconBtn />
          <AddPostMobileBtn />
        </div>
      </MobileHeaderWrapper>
    );
  }
  return (
    <MobileHeaderWrapper>
      <MobileHeaderBackBtn title={lastRouteMeta.title} />
    </MobileHeaderWrapper>
  );
}
