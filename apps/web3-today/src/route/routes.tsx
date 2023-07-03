/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 17:01:28
 * @Description: file description
 */
import { Navigate, RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';
import React, { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';

export enum RouteKey {
  home = 'home',
  events = 'events',
  eventCreate = 'eventCreate',
  eventEdit = 'eventEdit',
  event = 'event',
  contents = 'contents',
  content = 'content',
  contentCreate = 'contentCreate',
  favorite = 'favorite',
  noMatch = 'noMatch',
  web3Today = 'web3Today',
}
export enum RoutePermission {
  login = 'login',
  admin = 'admin',
}
export type CutomRouteObject = RouteObject & {
  key: RouteKey;
  children?: Array<CutomRouteObject>;
  permissions?: RoutePermission[];
};

const loadContainerElement = (fileName: string): ReactNode => {
  const Component = loadable(() => import(`../container/${fileName}.tsx`));
  return React.createElement(Component);
};
export const NoMatchRoute: CutomRouteObject = {
  path: '*',
  element: loadContainerElement('NoMatchRoute'),
  key: RouteKey.noMatch,
};
export const routes: CutomRouteObject[] = [
  {
    path: '/',
    element: loadContainerElement('Home'),
    key: RouteKey.home,
  },
  {
    path: '/favorite',
    element: loadContainerElement('Favorite'),
    key: RouteKey.favorite,
    permissions: [RoutePermission.login],
  },
  {
    path: '/events',
    element: loadContainerElement('Events'),
    key: RouteKey.events,
  },
  {
    path: '/events/:id',
    element: loadContainerElement('Events'),
    key: RouteKey.events,
  },
  {
    path: '/events/create',
    element: loadContainerElement('EventCreate'),
    key: RouteKey.eventCreate,
    permissions: [RoutePermission.login, RoutePermission.admin],
  },
  {
    path: '/events/:id/edit',
    element: loadContainerElement('EventEdit'),
    key: RouteKey.eventEdit,
    permissions: [RoutePermission.login, RoutePermission.admin],
  },
  {
    path: '/contents',
    element: loadContainerElement('Contents'),
    key: RouteKey.contents,
  },
  {
    path: '/contents/:id',
    element: isMobile
      ? loadContainerElement('Content')
      : loadContainerElement('Contents'),
    key: isMobile ? RouteKey.content : RouteKey.contents,
  },
  {
    path: '/contents/create',
    element: loadContainerElement('ContentCreate'),
    key: RouteKey.contentCreate,
    permissions: [RoutePermission.login],
  },
  NoMatchRoute,
];

export const getRoute = (key: RouteKey): CutomRouteObject | undefined => {
  let route: CutomRouteObject | undefined;
  const searchRoute = (routeAry: CutomRouteObject[]) => {
    for (const item of routeAry) {
      if (item.key === key) {
        route = item;
      } else if (item.children?.length) {
        searchRoute(item.children);
      }
      if (route) return;
    }
  };
  searchRoute(routes);
  return route;
};
