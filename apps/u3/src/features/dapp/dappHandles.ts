/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:15:44
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
  DappEntity,
  DappExploreListItemResponse,
} from '../../services/dapp/types/dapp';
import type { RootState } from '../../store/store';
import {
  favorDapp as favorDappApi,
  unfavorDapp as unfavorDappApi,
} from '../../services/dapp/api/dapp';
import {
  addOneWithDapps,
  removeOneWithDapps,
} from '../shared/userGroupFavorites';
import { updateOne as updateOneWithDappExplore } from './dappExploreList';
import { messages } from '../../utils/shared/message';

// 为dapp 点赞操作 创建一个执行队列
export type FavorDappParams = DappExploreListItemResponse;
export type FavorDappEntity = DappEntity;
type FavorDappQueueState = EntityState<FavorDappEntity>;
export const favorDappQueueEntity = createEntityAdapter<FavorDappEntity>({
  selectId: (item) => item.id,
});
const favorDappQueueState: FavorDappQueueState =
  favorDappQueueEntity.getInitialState();

// 为dapp 标记为操作 创建一个执行队列
export type CompleteDappParams = {
  id: number;
};
export type CompleteDappEntity = DappEntity;
type CompleteDappQueueState = EntityState<CompleteDappEntity>;
export const completeDappQueueEntity = createEntityAdapter<CompleteDappEntity>({
  selectId: (item) => item.id,
});
const completeDappQueueState: CompleteDappQueueState =
  completeDappQueueEntity.getInitialState();

// 统一管理操作
export type DappHandle<T> = {
  params: T | null;
  status: AsyncRequestStatus;
  errorMsg: string;
};

export type DappHandlesState = {
  favorDapp: DappHandle<FavorDappParams>;
  favorDappQueue: FavorDappQueueState;
  completeDapp: DappHandle<CompleteDappParams>;
  completeDappQueue: FavorDappQueueState;
};

// init data
const initDappHandlestate = {
  params: null,
  status: AsyncRequestStatus.IDLE,
  errorMsg: '',
};
const initDappHandlesState: DappHandlesState = {
  favorDapp: initDappHandlestate,
  favorDappQueue: favorDappQueueState,
  completeDapp: initDappHandlestate,
  completeDappQueue: completeDappQueueState,
};

// favor dapp
export const favorDapp = createAsyncThunk(
  'user/dappHandles/favorDapp',
  async (params: FavorDappParams, { dispatch }) => {
    dispatch(addOneToFavorDappQueue(params));
    const resp = await favorDappApi(params.id);
    if (resp.data.code === 0) {
      const newData = { ...params, favored: true };
      dispatch(updateOneWithDappExplore(newData));
      dispatch(addOneWithDapps(newData));
      dispatch(removeOneForFavorDappQueue(params.id));
      return newData;
    }
    dispatch(removeOneForFavorDappQueue(params.id));
    throw new Error(resp.data.msg);
  },
  {
    condition: (params: FavorDappParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = favorDappQueueEntity.getSelectors();
      const item = selectById(state.dappHandles.favorDappQueue, params.id);
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

// unfavor dapp
export const unfavorDapp = createAsyncThunk(
  'user/dappHandles/unfavorDapp',
  async (params: FavorDappParams, { dispatch }) => {
    dispatch(addOneToFavorDappQueue(params));
    const resp = await unfavorDappApi(params.id);
    if (resp.data.code === 0) {
      const newData = { ...params, favored: false };
      dispatch(updateOneWithDappExplore(newData));
      dispatch(removeOneWithDapps(params.id));
      dispatch(removeOneForFavorDappQueue(params.id));
      return newData;
    }
    dispatch(removeOneForFavorDappQueue(params.id));
    throw new Error(resp.data.msg);
  },
  {
    condition: (params: FavorDappParams, { getState }) => {
      const state = getState() as RootState;
      const { selectById } = favorDappQueueEntity.getSelectors();
      const item = selectById(state.dappHandles.favorDappQueue, params.id);
      // 如果正在请求阻止新的请求
      return !item;
    },
  }
);

export const dappHandlesSlice = createSlice({
  name: 'DappHandles',
  initialState: initDappHandlesState,
  reducers: {
    addOneToFavorDappQueue: (state, action) => {
      favorDappQueueEntity.addOne(state.favorDappQueue, action.payload);
    },
    removeOneForFavorDappQueue: (state, action) => {
      favorDappQueueEntity.removeOne(state.favorDappQueue, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(favorDapp.pending, (state, action) => {
        state.favorDapp.params = action.meta.arg;
        state.favorDapp.status = AsyncRequestStatus.PENDING;
        state.favorDapp.errorMsg = '';
      })
      .addCase(favorDapp.fulfilled, (state, action) => {
        state.favorDapp.params = null;
        state.favorDapp.status = AsyncRequestStatus.FULFILLED;
        state.favorDapp.errorMsg = '';
        toast.success(messages.dapp.install, { style: { right: '80px' } });
      })
      .addCase(favorDapp.rejected, (state, action) => {
        state.favorDapp.params = null;
        state.favorDapp.status = AsyncRequestStatus.REJECTED;
        state.favorDapp.errorMsg = action.error.message || '';
        toast.error(action.error.message || messages.common.error);
      });
  },
});

export const selectDappHandlesState = (state: RootState) => state.dappHandles;

export const {
  selectAll: selectAllFavorDappQueue,
  selectIds: selectIdsFavorDappQueue,
  selectById: selectByIdFavorDappQueue,
} = favorDappQueueEntity.getSelectors(
  (state: RootState) => state.dappHandles.favorDappQueue
);

const { actions, reducer } = dappHandlesSlice;
const { addOneToFavorDappQueue, removeOneForFavorDappQueue } = actions;
export default reducer;
