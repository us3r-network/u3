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
  dappStore = 'dappStore',
  dapp = 'dapp',
  dappCreate = 'dappCreate',
  projects = 'projects',
  project = 'project',
  projectCreate = 'projectCreate',
  contents = 'contents',
  content = 'content',
  contentCreate = 'contentCreate',
  favorite = 'favorite',
  frens = 'frens',
  profile = 'profile',
  profileByUser = 'profileByUser',
  noMatch = 'noMatch',
  policy = 'policy',
  web3Today = 'web3Today',
  activity = 'activity',
  stream = 'stream',
  family = 'family',
  asset = 'asset',
  gallery = 'gallery',
  notification = 'notification',
  save = 'save',
  farcaster = 'farcaster',
  farcasterData = 'farcasterData',
  farcasterSignup = 'farcasterSignup',
  farcasterProfile = 'farcasterProfile',
  socialLayout = 'socialLayout',
  social = 'social',
  socialChannel = 'socialChannel',
  socialTrendsChannel = 'socialTrendsChannel',
  socialPostDetailLens = 'socialPostDetailLens',
  socialPostDetailFcast = 'socialPostDetailFcast',
  socialSuggestFollow = 'socialSuggestFollow',
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
    element: <Navigate to="/social" />,
    key: RouteKey.home,
  },
  {
    path: '/web3-today',
    element: loadContainerElement('Web3Today'),
    key: RouteKey.web3Today,
  },
  {
    path: '/activity',
    element: loadContainerElement('Activity'),
    key: RouteKey.activity,
    permissions: [RoutePermission.login],
  },
  {
    path: '/stream/:streamId',
    element: loadContainerElement('Stream'),
    key: RouteKey.stream,
    permissions: [RoutePermission.login],
  },
  {
    path: '/family/:familyOrApp',
    element: loadContainerElement('StreamFamily'),
    key: RouteKey.family,
    permissions: [RoutePermission.login],
  },
  {
    path: '/asset',
    element: loadContainerElement('Asset'),
    key: RouteKey.asset,
    permissions: [RoutePermission.login],
  },
  {
    path: '/gallery',
    element: loadContainerElement('Gallery'),
    key: RouteKey.gallery,
    permissions: [RoutePermission.login],
  },
  {
    path: '/notification',
    element: loadContainerElement('Notification'),
    key: RouteKey.notification,
    permissions: [RoutePermission.login],
  },
  {
    path: '/favorite',
    element: loadContainerElement('Favorite'),
    key: RouteKey.favorite,
    permissions: [RoutePermission.login],
  },
  {
    path: '/save',
    element: loadContainerElement('Save'),
    key: RouteKey.save,
    permissions: [RoutePermission.login],
  },
  // {
  //   path: '/profile',
  //   element: loadContainerElement('ProfileRe'),
  //   key: RouteKey.profile,
  //   permissions: [RoutePermission.login],
  // },
  {
    path: '/u',
    element: loadContainerElement('Profile'),
    key: RouteKey.profile,
    permissions: [RoutePermission.login],
  },
  {
    path: '/u/:user',
    element: loadContainerElement('Profile'),
    key: RouteKey.profileByUser,
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
    path: '/dapp-store',
    element: loadContainerElement('Dapps'),
    key: RouteKey.dappStore,
  },
  {
    path: '/dapp-store/:id',
    element: loadContainerElement('Dapp'),
    key: RouteKey.dapp,
  },
  {
    path: '/dapp-store/create',
    element: loadContainerElement('DappCreate'),
    key: RouteKey.dappCreate,
    permissions: [RoutePermission.login, RoutePermission.admin],
  },
  // {
  //   path: '/projects',
  //   element: loadContainerElement('Projects'),
  //   key: RouteKey.projects,
  // },
  {
    path: '/projects/:id',
    element: loadContainerElement('Project'),
    key: RouteKey.project,
  },
  {
    path: '/projects/create',
    element: loadContainerElement('ProjectCreate'),
    key: RouteKey.projectCreate,
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
  {
    path: '/frens',
    element: loadContainerElement('Frens'),
    key: RouteKey.frens,
  },
  {
    path: '/policy',
    element: loadContainerElement('Policy'),
    key: RouteKey.policy,
  },
  {
    path: '/farcaster',
    element: loadContainerElement('FarcasterLayout'),
    key: RouteKey.farcaster,
    children: [
      {
        path: '',
        element: loadContainerElement('FarcasterData'),
        key: RouteKey.farcasterData,
      },
      {
        path: 'signup',
        element: loadContainerElement('FarcasterSignup'),
        key: RouteKey.farcasterSignup,
      } as CutomRouteObject,
      {
        path: 'profile',
        element: loadContainerElement('FarcasterProfile'),
        key: RouteKey.farcasterProfile,
      },
    ],
  },

  {
    path: '/social',
    element: loadContainerElement('SocialLayout'),
    key: RouteKey.socialLayout,
    children: [
      {
        path: '',
        element: loadContainerElement('Social'),
        key: RouteKey.social,
      },
      {
        path: 'trends',
        element: loadContainerElement('SocialTrends'),
        key: RouteKey.socialTrendsChannel,
      },
      {
        path: 'channel/:channelName',
        element: loadContainerElement('SocialChannel'),
        key: RouteKey.socialChannel,
      },
      {
        path: 'post-detail/lens/:publicationId',
        element: loadContainerElement('LensPostDetail'),
        key: RouteKey.socialPostDetailLens,
      } as CutomRouteObject,
      {
        path: 'post-detail/fcast/:castId',
        element: loadContainerElement('FarcasterPostDetail'),
        key: RouteKey.socialPostDetailFcast,
      },
      {
        path: 'suggest-follow',
        element: loadContainerElement('SocialSuggestFollow'),
        key: RouteKey.socialSuggestFollow,
      },
    ],
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
