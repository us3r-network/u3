/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-09 15:25:46
 * @Description: file description
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { AsyncRequestStatus } from '../../services/shared/types';
import {
  ProjectEntity,
  ProjectExploreListItemResponse,
} from '../../services/shared/types/project';
import type { RootState } from '../../store/store';
import {
  favorProject as favorProjectApi,
  unfavorProject as unfavorProjectApi,
} from '../../services/shared/api/project';
import {
  addOneWithProjects,
  removeOneWithProjects,
} from '../shared/userGroupFavorites';
import { updateOne as updateOneWithProjectExplore } from './projectExploreList';
import { messages } from '../../utils/shared/message';

// 为project 点赞操作 创建一个执行队列
export type FavorProjectParams = ProjectExploreListItemResponse;
export type FavorProjectEntity = ProjectEntity;
type FavorProjectQueueState = EntityState<FavorProjectEntity>;
export const favorProjectQueueEntity = createEntityAdapter<FavorProjectEntity>({
  selectId: (item) => item.id,
});
const favorProjectQueueState: FavorProjectQueueState =
  favorProjectQueueEntity.getInitialState();

// 为project 标记为操作 创建一个执行队列
export type CompleteProjectParams = {
  id: number;
};
export type CompleteProjectEntity = ProjectEntity;
type CompleteProjectQueueState = EntityState<CompleteProjectEntity>;
export const completeProjectQueueEntity =
  createEntityAdapter<CompleteProjectEntity>({
    selectId: (item) => item.id,
  });
const completeProjectQueueState: CompleteProjectQueueState =
  completeProjectQueueEntity.getInitialState();

// 统一管理操作
export type ProjectHandle<T> = {
  params: T | null;
  status: AsyncRequestStatus;
  errorMsg: string;
};

export type ProjectHandlesState = {
  favorProject: ProjectHandle<FavorProjectParams>;
  favorProjectQueue: FavorProjectQueueState;
  completeProject: ProjectHandle<CompleteProjectParams>;
  completeProjectQueue: FavorProjectQueueState;
};

// init data
const initProjectHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};
const initProjectHandlesState: ProjectHandlesState = {
  favorProject: initProjectHandlestate,
  favorProjectQueue: favorProjectQueueState,
  completeProject: initProjectHandlestate,
  completeProjectQueue: completeProjectQueueState,
};

// favor project
export const favorProject = createAsyncThunk(
  'user/projectHandles/favorProject',
  async (params: FavorProjectParams, { dispatch }) => {
    dispatch(addOneToFavorProjectQueue(params));
    const resp = await favorProjectApi(params.id);
    if (resp.data.code === 0) {
      const newData = { ...params, favored: true };
      dispatch(updateOneWithProjectExplore(newData));
      dispatch(addOneWithProjects(newData));
      dispatch(removeOneForFavorProjectQueue(params.id));
      return newData;
    }
    dispatch(removeOneForFavorProjectQueue(params.id));
    throw new Error(resp.data.msg);
  },
  {
    condition: (params: FavorProjectParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = favorProjectQueueEntity.getSelectors();
      const item = selectById(
        state.projectHandles.favorProjectQueue,
        params.id
      );
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

// unfavor project
export const unfavorProject = createAsyncThunk(
  'user/projectHandles/unfavorProject',
  async (params: FavorProjectParams, { dispatch }) => {
    dispatch(addOneToFavorProjectQueue(params));
    const resp = await unfavorProjectApi(params.id);
    if (resp.data.code === 0) {
      const newData = { ...params, favored: false };
      dispatch(updateOneWithProjectExplore(newData));
      dispatch(removeOneWithProjects(params.id));
      dispatch(removeOneForFavorProjectQueue(params.id));
      return newData;
    }
    dispatch(removeOneForFavorProjectQueue(params.id));
    throw new Error(resp.data.msg);
  },
  {
    condition: (params: FavorProjectParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = favorProjectQueueEntity.getSelectors();
      const item = selectById(
        state.projectHandles.favorProjectQueue,
        params.id
      );
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

export const projectHandlesSlice = createSlice({
  name: 'ProjectHandles',
  initialState: initProjectHandlesState,
  reducers: {
    addOneToFavorProjectQueue: (state, action) => {
      favorProjectQueueEntity.addOne(state.favorProjectQueue, action.payload);
    },
    removeOneForFavorProjectQueue: (state, action) => {
      favorProjectQueueEntity.removeOne(
        state.favorProjectQueue,
        action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(favorProject.pending, (state, action) => {
        state.favorProject.params = action.meta.arg;
        state.favorProject.status = AsyncRequestStatus.PENDING;
        state.favorProject.errorMsg = '';
      })
      .addCase(favorProject.fulfilled, (state, action) => {
        state.favorProject.params = null;
        state.favorProject.status = AsyncRequestStatus.FULFILLED;
        state.favorProject.errorMsg = '';
        toast.success(messages.dapp.install, { style: { right: '80px' } });
      })
      .addCase(favorProject.rejected, (state, action) => {
        state.favorProject.params = null;
        state.favorProject.status = AsyncRequestStatus.REJECTED;
        state.favorProject.errorMsg = action.error.message || '';
        toast.error(action.error.message || messages.common.error);
      });
  },
});

export const selectProjectHandlesState = (state: RootState) =>
  state.projectHandles;

export const {
  selectAll: selectAllFavorProjectQueue,
  selectIds: selectIdsFavorProjectQueue,
  selectById: selectByIdFavorProjectQueue,
} = favorProjectQueueEntity.getSelectors(
  (state: RootState) => state.projectHandles.favorProjectQueue
);

const { actions, reducer } = projectHandlesSlice;
const { addOneToFavorProjectQueue, removeOneForFavorProjectQueue } = actions;
export default reducer;
