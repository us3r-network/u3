/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:44:32
 * @Description: store
 */
import { configureStore } from '@reduxjs/toolkit';

import websiteReducer from '../features/website/websiteSlice';
import eventExploreList from '../features/event/eventExploreList';
// eslint-disable-next-line import/no-named-as-default
import eventCompletedList from '../features/event/eventCompletedList';
import userGroupFavorites from '../features/favorite/userGroupFavorites';
import configsTopics from '../features/configs/topics';
import configsPlatforms from '../features/configs/platforms';

import karma from '../features/profile/karma';

export const store = configureStore({
  reducer: {
    website: websiteReducer,
    eventExploreList,
    eventCompletedList,
    userGroupFavorites,
    configsTopics,
    configsPlatforms,
    karma,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
