/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-06 14:31:53
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:29:05
 * @Description: 用户的 favorites 分组数据
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import {
  fetchContentFavorites,
  fetchEventFavorites,
} from '../../services/api/favorite';
import { AsyncRequestStatus } from '../../services/types';
import {
  ContentFavoriteListItemResponse,
  EventFavoriteListItemResponse,
  UserGroupFavorites,
} from '../../services/types/favorite';
import type { RootState } from '../../store/store';

export type EventsEntityItem = EventFavoriteListItemResponse;
export type ContentsEntityItem = ContentFavoriteListItemResponse;
export type GroupFavoritesState = {
  status: AsyncRequestStatus;
  errorMsg: string;
  events: EntityState<EventsEntityItem>;
  contents: EntityState<ContentsEntityItem>;
};
export const eventsEntity = createEntityAdapter<EventFavoriteListItemResponse>({
  selectId: (item) => item.id,
});
export const contentsEntity =
  createEntityAdapter<ContentFavoriteListItemResponse>({
    selectId: (item) => item.id,
  });
const initEventsEntity = eventsEntity.getInitialState();
const initContentsEntity = contentsEntity.getInitialState();
const initGroupFavoritesState: GroupFavoritesState = {
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  events: initEventsEntity,
  contents: initContentsEntity,
};
export const fetchUserGroupFavorites = createAsyncThunk<
  UserGroupFavorites,
  {
    contentUrls?: string[];
    eventUrls?: string[];
  }
>(
  'favorite/userGroupFavorites',
  async (params) => {
    const [contentsResponse, eventsResponse] = await Promise.all([
      fetchContentFavorites(params.contentUrls ?? []),
      fetchEventFavorites(params.eventUrls ?? []),
    ]);
    return {
      contents: contentsResponse.data.data,
      events: eventsResponse.data.data,
    };
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { userGroupFavorites } = state;
      const { status } = userGroupFavorites;
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  }
);

export const userGroupFavoritesSlice = createSlice({
  name: 'userGroupFavorites',
  initialState: initGroupFavoritesState,
  reducers: {
    // events
    addOneWithEvents: (state, ...args) => {
      eventsEntity.addOne(state.events, ...args);
    },
    updateOneWithEvents: (state, ...args) => {
      eventsEntity.updateOne(state.events, ...args);
    },
    setOneWithEvents: (state, ...args) => {
      eventsEntity.setOne(state.events, ...args);
    },
    removeOneWithEvents: (state, ...args) => {
      eventsEntity.removeOne(state.events, ...args);
    },
    removeAllWithEvents: (state) => {
      eventsEntity.removeAll(state.events);
    },
    // contents
    addOneWithContents: (state, ...args) => {
      contentsEntity.addOne(state.contents, ...args);
    },
    updateOneWithContents: (state, ...args) => {
      contentsEntity.updateOne(state.contents, ...args);
    },
    setOneWithContents: (state, ...args) => {
      contentsEntity.setOne(state.contents, ...args);
    },
    removeOneWithContents: (state, ...args) => {
      contentsEntity.removeOne(state.contents, ...args);
    },
    removeAllWithContents: (state) => {
      contentsEntity.removeAll(state.contents);
    },

    // common
    removeAllFavorites: (state) => {
      eventsEntity.removeAll(state.events);
      contentsEntity.removeAll(state.contents);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserGroupFavorites.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(fetchUserGroupFavorites.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        eventsEntity.setAll(state.events, action.payload.events);
        contentsEntity.setAll(state.contents, action.payload.contents);
      })
      .addCase(fetchUserGroupFavorites.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
        eventsEntity.setAll(state.events, []);
        contentsEntity.setAll(state.contents, []);
      });
  },
});

const { actions, reducer } = userGroupFavoritesSlice;
export const {
  selectAll: selectAllForEvents,
  selectById: selectByIdForEvents,
  selectIds: selectIdsForEvents,
} = eventsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.events
);

export const {
  selectAll: selectAllForContents,
  selectById: selectByIdForContents,
  selectIds: selectIdsForContents,
} = contentsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.contents
);
export const selectState = (state: RootState) => state.userGroupFavorites;
export const {
  // events
  addOneWithEvents,
  updateOneWithEvents,
  setOneWithEvents,
  removeOneWithEvents,
  removeAllWithEvents,
  // contents
  addOneWithContents,
  updateOneWithContents,
  setOneWithContents,
  removeOneWithContents,
  removeAllWithContents,
  // common
  removeAllFavorites,
} = actions;
export default reducer;
