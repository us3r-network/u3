/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:00:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-07 15:10:03
 * @Description: file description
 */
import { Navigate, RouteObject } from 'react-router-dom';
import loadable from '@loadable/component';
import React, { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import LoadableFallback from '../components/layout/LoadableFallback';

export enum RouteKey {
  home = 'home',
  // profile
  profile = 'profile',
  profileByUser = 'profileByUser',
  asset = 'asset',
  gallery = 'gallery',
  activity = 'activity',
  farcaster = 'farcaster',
  farcasterData = 'farcasterData',
  farcasterSignup = 'farcasterSignup',
  farcasterProfile = 'farcasterProfile',
  // news
  newsLayout = 'newsLayout',
  links = 'links',
  link = 'link',
  contents = 'contents',
  content = 'content',
  contentCreate = 'contentCreate',
  events = 'events',
  eventCreate = 'eventCreate',
  eventEdit = 'eventEdit',
  event = 'event',
  favorite = 'favorite',
  // social
  socialLayout = 'socialLayout',
  social = 'social',
  socialAll = 'socialAll',
  socialAllTrending = 'socialAllTrending',
  socialAllFollowing = 'socialAllFollowing',
  socialAllWhatsnew = 'socialAllWhatsnew',
  socialFarcaster = 'socialFarcaster',
  socialFarcasterTrending = 'socialFarcasterTrending',
  socialFarcasterFollowing = 'socialFarcasterFollowing',
  socialFarcasterWhatsnew = 'socialFarcasterWhatsnew',
  socialLens = 'socialLens',
  socialLensTrending = 'socialLensTrending',
  socialLensFollowing = 'socialLensFollowing',
  socialLensWhatsnew = 'socialLensWhatsnew',
  socialChannel = 'socialChannel',
  socialTrendsChannel = 'socialTrendsChannel',
  socialPostDetailLens = 'socialPostDetailLens',
  socialPostDetailFcast = 'socialPostDetailFcast',
  socialSuggestFollow = 'socialSuggestFollow',
  // apps
  dappStore = 'dappStore',
  dapp = 'dapp',
  dappCreate = 'dappCreate',
  // save
  save = 'save',
  // notification
  notification = 'notification',
  // others
  noMatch = 'noMatch',
  policy = 'policy',

  // deprecated
  projects = 'projects',
  project = 'project',
  projectCreate = 'projectCreate',
  frens = 'frens',
}
export enum RoutePermission {
  login = 'login',
  admin = 'admin',
}
export type CutomRouteObject = RouteObject & {
  key: RouteKey;
  children?: Array<CutomRouteObject>;
  permissions?: RoutePermission[];
  title?: string;
};

const loadContainerElement = (fileName: string): ReactNode => {
  const Component = loadable(() => import(`../container/${fileName}.tsx`), {
    fallback: <LoadableFallback />,
  });
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
    element: loadContainerElement('Explore'),
    key: RouteKey.home,
    title: 'Explore',
  },
  // profile
  {
    path: '/u',
    element: loadContainerElement('profile/Profile'),
    key: RouteKey.profile,
    permissions: [RoutePermission.login],
    title: 'Profile',
  },
  {
    path: '/u/:user',
    element: loadContainerElement('profile/Profile'),
    key: RouteKey.profileByUser,
    title: 'Profile',
  },
  {
    path: '/activity',
    element: loadContainerElement('Activity'),
    key: RouteKey.activity,
    permissions: [RoutePermission.login],
    title: 'Activity',
  },
  {
    path: '/asset',
    element: loadContainerElement('Asset'),
    key: RouteKey.asset,
    permissions: [RoutePermission.login],
    title: 'Asset',
  },
  {
    path: '/gallery',
    element: loadContainerElement('Gallery'),
    key: RouteKey.gallery,
    permissions: [RoutePermission.login],
    title: 'Gallery',
  },
  // news
  {
    path: '/b',
    element: loadContainerElement('news/NewsLayout'),
    key: RouteKey.newsLayout,
    title: 'Browse',
    children: [
      {
        path: '',
        element: <Navigate to="links/all" />,
        key: RouteKey.links,
      } as CutomRouteObject,
      {
        path: 'links/:group',
        element: loadContainerElement('news/Links'),
        key: RouteKey.links,
      },
      {
        path: 'links/:group/:link',
        element: isMobile
          ? loadContainerElement('news/LinkMobile')
          : loadContainerElement('news/Links'),
        key: isMobile ? RouteKey.link : RouteKey.links,
      },
      {
        path: 'contents',
        element: loadContainerElement('news/Contents'),
        key: RouteKey.contents,
      },
      {
        path: 'contents/:id',
        element: isMobile
          ? loadContainerElement('news/Content')
          : loadContainerElement('news/Contents'),
        key: isMobile ? RouteKey.content : RouteKey.contents,
      },
      {
        path: 'contents/create',
        element: loadContainerElement('news/ContentCreate'),
        key: RouteKey.contentCreate,
        permissions: [RoutePermission.login],
      },
      {
        path: 'events',
        element: loadContainerElement('news/Events'),
        key: RouteKey.events,
      },
      {
        path: 'events/:id',
        element: loadContainerElement('news/Events'),
        key: RouteKey.events,
      },
      {
        path: 'events/create',
        element: loadContainerElement('news/EventCreate'),
        key: RouteKey.eventCreate,
        permissions: [RoutePermission.login, RoutePermission.admin],
      },
      {
        path: 'events/:id/edit',
        element: loadContainerElement('news/EventEdit'),
        key: RouteKey.eventEdit,
        permissions: [RoutePermission.login, RoutePermission.admin],
      },
      {
        path: 'favorite',
        element: loadContainerElement('news/Favorite'),
        key: RouteKey.favorite,
        permissions: [RoutePermission.login],
      },
    ],
  },
  // social
  {
    path: '/social',
    element: loadContainerElement('social/SocialLayout'),
    key: RouteKey.socialLayout,
    title: 'Social',
    children: [
      {
        path: '',
        element: <Navigate to="all" />,
        key: RouteKey.home,
      } as CutomRouteObject,
      {
        path: 'all', // social allPlatform
        element: loadContainerElement('social/SocialAll'),
        key: RouteKey.socialAll,
        children: [
          {
            path: '', // default trending
            element: loadContainerElement('social/SocialAllTrending'),
            key: RouteKey.socialAllTrending,
          },
          {
            path: 'following',
            element: loadContainerElement('social/SocialAllFollowing'),
            key: RouteKey.socialAllFollowing,
          } as CutomRouteObject,
          {
            path: 'whatsnew',
            element: loadContainerElement('social/SocialAllWhatsnew'),
            key: RouteKey.socialAllWhatsnew,
          } as CutomRouteObject,
        ],
      },
      {
        path: 'farcaster',
        element: loadContainerElement('social/SocialFarcaster'),
        key: RouteKey.socialFarcaster,
        children: [
          {
            path: '', // default trending
            element: loadContainerElement('social/SocialFarcasterTrending'),
            key: RouteKey.socialFarcasterTrending,
          },
          {
            path: 'following',
            element: loadContainerElement('social/SocialFarcasterFollowing'),
            key: RouteKey.socialFarcasterFollowing,
          } as CutomRouteObject,
          {
            path: 'whatsnew',
            element: loadContainerElement('social/SocialFarcasterWhatsnew'),
            key: RouteKey.socialFarcasterWhatsnew,
          },
        ],
      },
      {
        path: 'lens', // social Lens platform
        element: loadContainerElement('social/SocialLens'),
        key: RouteKey.socialLens,
        children: [
          {
            path: '', // default trending
            element: loadContainerElement('social/SocialLensTrending'),
            key: RouteKey.socialLensTrending,
          },
          {
            path: 'following',
            element: loadContainerElement('social/SocialLensFollowing'),
            key: RouteKey.socialLensFollowing,
          } as CutomRouteObject,
          {
            path: 'whatsnew',
            element: loadContainerElement('social/SocialLensWhatsnew'),
            key: RouteKey.socialLensWhatsnew,
          },
        ],
      },
      {
        path: 'trends',
        element: loadContainerElement('social/SocialTrends'),
        key: RouteKey.socialTrendsChannel,
      },
      {
        path: 'channel/:channelId',
        element: loadContainerElement('social/SocialChannel'),
        key: RouteKey.socialChannel,
      },
      {
        path: 'post-detail/lens/:publicationId',
        element: loadContainerElement('social/LensPostDetail'),
        key: RouteKey.socialPostDetailLens,
      } as CutomRouteObject,
      {
        path: 'post-detail/fcast/:castId',
        element: loadContainerElement('social/FarcasterPostDetail'),
        key: RouteKey.socialPostDetailFcast,
      },
      {
        path: 'suggest-follow',
        element: loadContainerElement('social/SocialSuggestFollow'),
        key: RouteKey.socialSuggestFollow,
      },
    ],
  },
  {
    path: '/farcaster',
    element: loadContainerElement('social/FarcasterLayout'),
    key: RouteKey.farcaster,
    children: [
      {
        path: '',
        element: loadContainerElement('social/FarcasterData'),
        key: RouteKey.farcasterData,
      },
      {
        path: 'signup',
        element: loadContainerElement('social/FarcasterSignup'),
        key: RouteKey.farcasterSignup,
      } as CutomRouteObject,
      {
        path: 'profile',
        element: loadContainerElement('social/FarcasterProfile'),
        key: RouteKey.farcasterProfile,
      },
    ],
  },
  // apps
  {
    path: '/dapp-store',
    element: loadContainerElement('dapp/Dapps'),
    key: RouteKey.dappStore,
    title: 'Explore Dapps',
  },
  {
    path: '/dapp-store/:id',
    element: loadContainerElement('dapp/Dapp'),
    key: RouteKey.dapp,
    title: 'Dapp',
  },
  {
    path: '/dapp-store/create',
    element: loadContainerElement('dapp/DappCreate'),
    key: RouteKey.dappCreate,
    permissions: [RoutePermission.login, RoutePermission.admin],
  },
  // save
  {
    path: '/save',
    element: loadContainerElement('Save'),
    key: RouteKey.save,
    permissions: [RoutePermission.login],
  },
  {
    path: '/policy',
    element: loadContainerElement('Policy'),
    key: RouteKey.policy,
  },
  // notification
  {
    path: '/notification',
    element: loadContainerElement('Notification'),
    key: RouteKey.notification,
    title: 'Notifications',
  },
  NoMatchRoute,

  // deprecated
  // {
  //   path: '/projects',
  //   element: loadContainerElement('Projects'),
  //   key: RouteKey.projects,
  // },
  // {
  //   path: '/projects/:id',
  //   element: loadContainerElement('Project'),
  //   key: RouteKey.project,
  // },
  // {
  //   path: '/projects/create',
  //   element: loadContainerElement('ProjectCreate'),
  //   key: RouteKey.projectCreate,
  //   permissions: [RoutePermission.login, RoutePermission.admin],
  // },
  // {
  //   path: '/frens',
  //   element: loadContainerElement('Frens'),
  //   key: RouteKey.frens,
  // },
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
