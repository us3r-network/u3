/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-12 13:59:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 09:41:30
 * @Description: file description
 */
import React, { ReactNode } from 'react';
import { ReactComponent as CompassSvg } from './svgs/compass.svg';
import { ReactComponent as LineChartUpSvg } from './svgs/line-chart-up.svg';
import { ReactComponent as HeartSvg } from './svgs/heart.svg';
import { ReactComponent as WalletSvg } from './svgs/wallet.svg';
import { ReactComponent as ImageSvg } from './svgs/image.svg';
import { ReactComponent as BellSvg } from './svgs/bell.svg';
import { ReactComponent as UserCircleSvg } from './svgs/user-circle.svg';
import { ReactComponent as SocialSvg } from './svgs/social.svg';

import { CutomRouteObject, getRoute, RouteKey } from './routes';

export type CutomNavObject = {
  name: string;
  activeRouteKeys: RouteKey[];
  icon?: ReactNode;
  children?: CutomNavObject[];
  key?: string;
  route?: CutomRouteObject;
};
export const navs: CutomNavObject[] = [
  {
    name: 'dapp store',
    activeRouteKeys: [RouteKey.dappStore, RouteKey.dapp],
    icon: React.createElement(CompassSvg),
    route: getRoute(RouteKey.dappStore),
  },
  {
    name: 'profile',
    activeRouteKeys: [RouteKey.profile],
    icon: React.createElement(UserCircleSvg),
    route: getRoute(RouteKey.profile),
  },
  {
    name: 'activity',
    activeRouteKeys: [RouteKey.activity],
    icon: React.createElement(LineChartUpSvg),
    route: getRoute(RouteKey.activity),
  },
  {
    name: 'save',
    activeRouteKeys: [RouteKey.save],
    icon: React.createElement(HeartSvg),
    route: getRoute(RouteKey.save),
  },
  {
    name: 'asset',
    activeRouteKeys: [RouteKey.asset],
    icon: React.createElement(WalletSvg),
    route: getRoute(RouteKey.asset),
  },
  {
    name: 'gallery',
    activeRouteKeys: [RouteKey.gallery],
    icon: React.createElement(ImageSvg),
    route: getRoute(RouteKey.gallery),
  },
  {
    name: 'notification',
    activeRouteKeys: [RouteKey.notification],
    icon: React.createElement(BellSvg),
    route: getRoute(RouteKey.notification),
  },
  {
    name: 'social',
    activeRouteKeys: [RouteKey.social],
    icon: React.createElement(SocialSvg),
    route: getRoute(RouteKey.social),
  },
];
