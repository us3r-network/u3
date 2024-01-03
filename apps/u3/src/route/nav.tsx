/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 13:59:01
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-15 09:18:03
 * @Description: file description
 */
import React, { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { ReactComponent as CompassSvg } from './svgs/compass.svg';
import { ReactComponent as NewsSvg } from './svgs/news.svg';
import { ReactComponent as SocialSvg } from './svgs/social.svg';
import { ReactComponent as DappSvg } from './svgs/dapp.svg';
import { ReactComponent as BookmarkSvg } from './svgs/bookmark.svg';
import { ReactComponent as BellSvg } from './svgs/bell.svg';

import { CutomRouteObject, getRoute, RouteKey } from './routes';
import NotificationButton from '@/components/notification/NotificationNavBtn';
import MobileNotificationNavBtn from '@/components/notification/MobileNotificationNavBtn';

export type CustomNavObject = {
  name: string;
  activeRouteKeys: RouteKey[]; // 指定哪些路由key下，该nav被激活（可用来高亮显示,有子菜单展开子菜单等...）
  icon?: ReactNode;
  children?: CustomNavObject[];
  key?: string;
  route?: CutomRouteObject;
  component?: JSX.Element;
};
export const navs: CustomNavObject[] = [
  {
    name: 'Explore',
    activeRouteKeys: [RouteKey.home],
    icon: React.createElement(CompassSvg),
    route: getRoute(RouteKey.home),
  },
  {
    name: 'Apps',
    activeRouteKeys: [
      RouteKey.newsLayout,
      RouteKey.links,
      RouteKey.link,
      RouteKey.contents,
      RouteKey.content,
      RouteKey.contentCreate,
      RouteKey.events,
      RouteKey.event,
      RouteKey.eventCreate,
      RouteKey.eventEdit,
    ],
    icon: React.createElement(NewsSvg),
    route: getRoute(RouteKey.newsLayout),
  },
  {
    name: 'Social',
    activeRouteKeys: [
      RouteKey.social,
      RouteKey.socialLayout,
      RouteKey.socialPostDetailFcast,
      RouteKey.socialPostDetailLens,
    ],
    icon: React.createElement(SocialSvg),
    route: getRoute(RouteKey.socialLayout),
  },
  {
    name: 'notifications',
    activeRouteKeys: [RouteKey.notification],
    component: isMobile ? (
      <MobileNotificationNavBtn key={RouteKey.notification} />
    ) : (
      <NotificationButton key={RouteKey.notification} />
    ),
  },
  ...(isMobile
    ? [
        {
          name: 'Apps',
          activeRouteKeys: [RouteKey.dappStore, RouteKey.dapp],
          icon: React.createElement(DappSvg),
          route: getRoute(RouteKey.dappStore),
        },
      ]
    : []),
  ...(isMobile
    ? []
    : [
        {
          name: 'Save',
          activeRouteKeys: [RouteKey.save],
          icon: React.createElement(BookmarkSvg),
          route: getRoute(RouteKey.save),
        },
      ]),

  // {
  //   name: 'profile',
  //   activeRouteKeys: [RouteKey.profile],
  //   icon: React.createElement(UserCircleSvg),
  //   route: getRoute(RouteKey.profile),
  // },
  // {
  //   name: 'activity',
  //   activeRouteKeys: [RouteKey.activity],
  //   icon: React.createElement(LineChartUpSvg),
  //   route: getRoute(RouteKey.activity),
  // },
  // {
  //   name: 'asset',
  //   activeRouteKeys: [RouteKey.asset],
  //   icon: React.createElement(WalletSvg),
  //   route: getRoute(RouteKey.asset),
  // },
  // {
  //   name: 'gallery',
  //   activeRouteKeys: [RouteKey.gallery],
  //   icon: React.createElement(ImageSvg),
  //   route: getRoute(RouteKey.gallery),
  // },
];
