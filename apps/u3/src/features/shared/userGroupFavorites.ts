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
  fetchDappFavorites,
  fetchEventFavorites,
} from '../../services/news/api/favorite';
import { AsyncRequestStatus } from '../../services/shared/types';
import {
  ContentFavoriteListItemResponse,
  EventFavoriteListItemResponse,
  ProjectFavoriteListItemResponse,
  DappFavoriteListItemResponse,
  UserGroupFavorites,
} from '../../services/news/types/favorite';
import type { RootState } from '../../store/store';

export type EventsEntityItem = EventFavoriteListItemResponse;
export type ProjectsEntityItem = ProjectFavoriteListItemResponse;
export type DappsEntityItem = DappFavoriteListItemResponse;
export type ContentsEntityItem = ContentFavoriteListItemResponse;
export type GroupFavoritesState = {
  status: AsyncRequestStatus;
  errorMsg: string;
  events: EntityState<EventsEntityItem>;
  projects: EntityState<ProjectsEntityItem>;
  dapps: EntityState<DappsEntityItem>;
  contents: EntityState<ContentsEntityItem>;
};
export const eventsEntity = createEntityAdapter<EventFavoriteListItemResponse>({
  selectId: (item) => item.id,
});
export const projectsEntity =
  createEntityAdapter<ProjectFavoriteListItemResponse>({
    selectId: (item) => item.id,
  });
export const dappsEntity = createEntityAdapter<DappFavoriteListItemResponse>({
  selectId: (item) => item.id,
});
export const contentsEntity =
  createEntityAdapter<ContentFavoriteListItemResponse>({
    selectId: (item) => item.id,
  });
const initEventsEntity = eventsEntity.getInitialState();
const initProjectsEntity = projectsEntity.getInitialState();
const initDappsEntity = dappsEntity.getInitialState();
const initContentsEntity = contentsEntity.getInitialState();
const initGroupFavoritesState: GroupFavoritesState = {
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
  events: initEventsEntity,
  projects: initProjectsEntity,
  dapps: initDappsEntity,
  contents: initContentsEntity,
};
export const fetchUserGroupFavorites = createAsyncThunk<
  UserGroupFavorites,
  {
    contentUrls?: string[];
    eventUrls?: string[];
    projectUrls?: string[];
    dappUrls?: string[];
  }
>(
  'favorite/userGroupFavorites',
  async (params) => {
    const [contentsResponse, dappsResponse, eventsResponse] = await Promise.all(
      [
        fetchContentFavorites(params.contentUrls ?? []),
        fetchDappFavorites(params.dappUrls ?? []),
        fetchEventFavorites(params.eventUrls ?? []),
      ]
    );

    return {
      contents: contentsResponse.data.data,
      dapps: dappsResponse.data.data,
      events: eventsResponse.data.data,
      projects: [],
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
    // projects
    addOneWithProjects: (state, ...args) => {
      projectsEntity.addOne(state.projects, ...args);
    },
    updateOneWithProjects: (state, ...args) => {
      projectsEntity.updateOne(state.projects, ...args);
    },
    setOneWithProjects: (state, ...args) => {
      projectsEntity.setOne(state.projects, ...args);
    },
    removeOneWithProjects: (state, ...args) => {
      projectsEntity.removeOne(state.projects, ...args);
    },
    removeAllWithProjects: (state) => {
      projectsEntity.removeAll(state.projects);
    },
    // dapps
    addOneWithDapps: (state, ...args) => {
      dappsEntity.addOne(state.dapps, ...args);
    },
    updateOneWithDapps: (state, ...args) => {
      dappsEntity.updateOne(state.dapps, ...args);
    },
    setOneWithDapps: (state, ...args) => {
      dappsEntity.setOne(state.dapps, ...args);
    },
    removeOneWithDapps: (state, ...args) => {
      dappsEntity.removeOne(state.dapps, ...args);
    },
    removeAllWithDapps: (state) => {
      dappsEntity.removeAll(state.dapps);
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
      projectsEntity.removeAll(state.projects);
      dappsEntity.removeAll(state.dapps);
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
        projectsEntity.setAll(state.projects, action.payload.projects);
        dappsEntity.setAll(state.dapps, action.payload.dapps);
        contentsEntity.setAll(state.contents, action.payload.contents);
      })
      .addCase(fetchUserGroupFavorites.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
        eventsEntity.setAll(state.events, []);
        projectsEntity.setAll(state.projects, []);
        dappsEntity.setAll(state.dapps, []);
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
  selectAll: selectAllForProjects,
  selectById: selectByIdForProjects,
  selectIds: selectIdsForProjects,
} = projectsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.projects
);
export const {
  selectAll: selectAllForDapps,
  selectById: selectByIdForDapps,
  selectIds: selectIdsForDapps,
} = dappsEntity.getSelectors(
  (state: RootState) => state.userGroupFavorites.dapps
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
  // projects
  addOneWithProjects,
  updateOneWithProjects,
  setOneWithProjects,
  removeOneWithProjects,
  removeAllWithProjects,
  // dapps
  addOneWithDapps,
  updateOneWithDapps,
  setOneWithDapps,
  removeOneWithDapps,
  removeAllWithDapps,
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
