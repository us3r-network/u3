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
  // poster
  posterGallery = 'posterGallery',
  casterDaily = 'casterDaily',
  // profile
  profile = 'profile',
  profileByUser = 'profileByUser',
  contacts = 'contacts',
  fav = 'fav',
  asset = 'asset',
  gallery = 'gallery',
  activity = 'activity',
  farcaster = 'farcaster',
  farcasterData = 'farcasterData',
  farcasterSignup = 'farcasterSignup',
  farcasterProfile = 'farcasterProfile',
  // community
  communities = 'communities',
  trendingCommunities = 'trendingCommunities',
  newestCommunities = 'newestCommunities',
  joinedCommunities = 'joinedCommunities',
  community = 'community',
  communityPostsLayout = 'communityPostsLayout',
  communityPostsFcTrending = 'communityPostsFcTrending',
  communityPostsFcNewest = 'communityPostsFcNewest',
  communityPostFcDetail = 'communityPostFcDetail',
  communityMembers = 'communityMembers',
  communityLinks = 'communityLinks',
  iframeLayout = 'iframeLayout',
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
  // notification
  notification = 'notification',
  notificationActivity = 'notificationActivity',
  notificationMention = 'notificationMention',
  // message
  message = 'message',
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
    element: loadContainerElement('explore/ExploreLayout'),
    key: RouteKey.home,
    title: 'Explore',
    children: [
      {
        path: '',
        element: loadContainerElement('explore/Home'),
        key: RouteKey.home,
        title: 'Explore',
      },
      {
        path: '/poster-gallery',
        element: loadContainerElement('poster/PosterGallery'),
        key: RouteKey.posterGallery,
        title: 'Poster Gallery',
      } as CutomRouteObject,
      {
        path: '/caster-daily',
        element: loadContainerElement('poster/CasterDaily'),
        key: RouteKey.casterDaily,
        title: 'Caster Daily',
      } as CutomRouteObject,
      {
        path: 'communities',
        element: loadContainerElement('community/Communities'),
        key: RouteKey.communities,
        title: 'Communities',
        children: [
          {
            path: '',
            element: <Navigate to="trending" />,
            key: RouteKey.trendingCommunities,
          } as CutomRouteObject,
          {
            path: 'trending',
            element: loadContainerElement('community/CommunitiesTrending'),
            key: RouteKey.trendingCommunities,
            title: 'Trending Communities',
          },
          {
            path: 'newest',
            element: loadContainerElement('community/CommunitiesNewest'),
            key: RouteKey.newestCommunities,
            title: 'Newest Communities',
          },
          {
            path: 'joined',
            element: loadContainerElement('community/CommunitiesJoined'),
            key: RouteKey.joinedCommunities,
            title: 'Joined Communities',
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
                element: loadContainerElement(
                  'social/SocialFarcasterFollowing'
                ),
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
    ],
  },

  // profile
  {
    path: '/u',
    element: loadContainerElement('profile/ProfileLayout'),
    key: RouteKey.profile,
    permissions: [RoutePermission.login],
    title: 'Profile',
    children: [
      {
        path: '',
        element: loadContainerElement('profile/Posts'),
        key: RouteKey.profile,
        permissions: [RoutePermission.login],
        title: 'Posts',
      },
      {
        path: 'contacts',
        element: loadContainerElement('profile/Contacts'),
        key: RouteKey.contacts,
        title: 'Contacts',
        permissions: [RoutePermission.login],
      },
      {
        path: 'fav',
        element: loadContainerElement('profile/Fav'),
        key: RouteKey.fav,
        title: 'Favorites',
        permissions: [RoutePermission.login],
      },
      {
        path: 'activity',
        element: loadContainerElement('profile/Activity'),
        key: RouteKey.activity,
        permissions: [RoutePermission.login],
        title: 'Activity',
      },
      {
        path: 'asset',
        element: loadContainerElement('profile/Asset'),
        key: RouteKey.asset,
        permissions: [RoutePermission.login],
        title: 'Asset',
      },
      {
        path: 'gallery',
        element: loadContainerElement('profile/Gallery'),
        key: RouteKey.gallery,
        permissions: [RoutePermission.login],
        title: 'Gallery',
      },
      {
        path: ':user',
        element: loadContainerElement('profile/Posts'),
        key: RouteKey.profileByUser,
        title: 'Posts',
      } as CutomRouteObject,
      {
        path: 'contacts/:user',
        element: loadContainerElement('profile/Contacts'),
        key: RouteKey.contacts,
        title: 'Contacts',
      } as CutomRouteObject,
      {
        path: 'fav/:user',
        element: loadContainerElement('profile/Fav'),
        key: RouteKey.fav,
        title: 'Favorites',
      } as CutomRouteObject,
      {
        path: 'activity/:user',
        element: loadContainerElement('profile/Activity'),
        key: RouteKey.activity,
        title: 'Activity',
      } as CutomRouteObject,
      {
        path: 'asset/:user',
        element: loadContainerElement('profile/Asset'),
        key: RouteKey.asset,
        title: 'Asset',
      } as CutomRouteObject,
      {
        path: 'gallery/:user',
        element: loadContainerElement('profile/Gallery'),
        key: RouteKey.gallery,
        title: 'Gallery',
      } as CutomRouteObject,
    ],
  },
  {
    path: '/policy',
    element: loadContainerElement('Policy'),
    key: RouteKey.policy,
  },
  // notification
  {
    path: '/notification',
    element: loadContainerElement('notification/NotificationLayout'),
    key: RouteKey.notification,
    permissions: [RoutePermission.login],
    title: 'Notifications',
    children: [
      {
        path: '',
        element: loadContainerElement('notification/Notification'),
        key: RouteKey.notification,
        title: 'Notifications',
      },
      {
        path: 'activity',
        element: loadContainerElement('notification/Notification'),
        key: RouteKey.notificationActivity,
        title: 'Notifications',
      },
      {
        path: 'mention',
        element: loadContainerElement('notification/Notification'),
        key: RouteKey.notificationMention,
        title: 'Notifications',
      },
    ],
  },
  // message
  {
    path: '/message',
    element: loadContainerElement('message/MessageLayout'),
    key: RouteKey.message,
    title: 'Message',
    permissions: [RoutePermission.login],
  },
  // community
  {
    path: '/community/:channelId',
    element: loadContainerElement('community/CommunityLayout'),
    key: RouteKey.community,
    title: 'Community',
    children: [
      {
        path: '',
        element: <Navigate to="posts" />,
        key: RouteKey.community,
      } as CutomRouteObject,
      {
        path: 'posts',
        element: loadContainerElement('community/PostsLayout'),
        key: RouteKey.community,
        children: [
          {
            path: '', // default fc
            element: <Navigate to="fc" />,
            key: RouteKey.communityPostsFcTrending,
          } as CutomRouteObject,
          {
            path: 'fc', // default trending
            key: RouteKey.communityPostsFcTrending,
            children: [
              {
                path: '', // default trending
                element: <Navigate to="trending" />,
                key: RouteKey.communityPostsFcTrending,
              } as CutomRouteObject,
              {
                path: 'trending', // default trending
                element: loadContainerElement('community/PostsFcTrending'),
                key: RouteKey.communityPostsFcTrending,
              },
              {
                path: 'newest',
                element: loadContainerElement('community/PostsFcNewest'),
                key: RouteKey.communityPostsFcNewest,
              },
              {
                path: ':castId',
                element: loadContainerElement('community/FarcasterPostDetail'),
                key: RouteKey.communityPostFcDetail,
              } as CutomRouteObject,
            ],
          },
        ],
      },
      {
        path: 'members',
        element: loadContainerElement('community/MembersLayout'),
        key: RouteKey.communityMembers,
        title: 'Members',
      },
      {
        path: 'links',
        element: loadContainerElement('community/PostsFcMentionedLinks'),
        key: RouteKey.communityLinks,
        title: 'Links',
      },
      {
        path: 'point',
        element: loadContainerElement('community/IframeLayout'),
        key: RouteKey.iframeLayout,
        title: 'App',
      },
      {
        path: ':configType/:configId',
        element: loadContainerElement('community/IframeLayout'),
        key: RouteKey.iframeLayout,
        title: 'App',
      },
    ],
  },
  // news
  {
    path: '/b',
    element: loadContainerElement('news/NewsLayout'),
    key: RouteKey.newsLayout,
    title: 'Apps',
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
        path: 'signupv2',
        element: loadContainerElement('social/FarcasterSignupV2'),
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
    path: '/apps',
    element: loadContainerElement('dapp/Dapps'),
    key: RouteKey.dappStore,
    title: 'Explore Apps',
  },
  {
    path: '/apps/:id',
    element: loadContainerElement('dapp/Dapp'),
    key: RouteKey.dapp,
    title: 'Apps',
  },
  {
    path: '/apps/create',
    element: loadContainerElement('dapp/DappCreate'),
    key: RouteKey.dappCreate,
    permissions: [RoutePermission.login, RoutePermission.admin],
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
