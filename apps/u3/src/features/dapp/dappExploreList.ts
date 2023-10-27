/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:08:13
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { fetchListForDappExplore } from '../../services/dapp/api/dapp';
import { ApiRespCode, AsyncRequestStatus } from '../../services/shared/types';
import {
  DappExploreListItemResponse,
  DappExploreListParams,
} from '../../services/dapp/types/dapp';
import type { RootState } from '../../store/store';

export type DappExploreListItem = DappExploreListItemResponse;
type DappExploreListStore = EntityState<DappExploreListItem> & {
  status: AsyncRequestStatus;
  moreStatus: AsyncRequestStatus;
  noMore: boolean;
  pageNumber: number;
  errorMsg: string;
  moreErrorMsg: string;
  currentRequestId: string; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};

const PAGE_SIZE = 50;
const PAGE_NUMBER_FIRST = 0;
export const dappExploreListEntity = createEntityAdapter<DappExploreListItem>({
  selectId: (item) => item.id,
});
const initTodoTasksState: DappExploreListStore =
  dappExploreListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    moreStatus: AsyncRequestStatus.IDLE,
    noMore: false,
    pageNumber: PAGE_NUMBER_FIRST,
    errorMsg: '',
    moreErrorMsg: '',
    currentRequestId: '',
  });
// 重新获取列表
export const fetchDappExploreList = createAsyncThunk<
  Array<DappExploreListItem>,
  DappExploreListParams
>('dapp/explore/list', async (params, { rejectWithValue }) => {
  const resp = await fetchListForDappExplore({
    ...params,
    pageSize: PAGE_SIZE,
    pageNumber: PAGE_NUMBER_FIRST,
  });
  if (resp.data.code === ApiRespCode.SUCCESS) {
    return resp.data.data;
  }
  return rejectWithValue(new Error(resp.data.msg));
});

// 获取更多
export const fetchMoreDappExploreList = createAsyncThunk<
  Array<DappExploreListItem>,
  DappExploreListParams
>(
  'dapp/explore/page',
  async (params, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { dappExploreList } = state;
    const { pageNumber } = dappExploreList;
    const resp = await fetchListForDappExplore({
      ...params,
      pageSize: PAGE_SIZE,
      pageNumber: pageNumber + 1,
    });
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { dappExploreList } = state;
      const { status, moreStatus } = dappExploreList;
      // 之前的请求正在进行中,则阻止新的请求
      if (
        status === AsyncRequestStatus.PENDING ||
        moreStatus === AsyncRequestStatus.PENDING
      ) {
        return false;
      }
      return true;
    },
  }
);

export const dappExploreListSlice = createSlice({
  name: 'dappExploreList',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: (state, action: PayloadAction<Partial<DappExploreListItem>>) => {
      const updateData = action.payload;
      dappExploreListEntity.updateOne(state, {
        id: updateData.id,
        changes: updateData,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDappExploreList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.pageNumber = 0;
        state.currentRequestId = action.meta.requestId;
        state.noMore = false;
      })
      .addCase(fetchDappExploreList.fulfilled, (state, action) => {
        const { currentRequestId } = state;
        const { requestId } = action.meta;
        // 多个异步请求返回时，使用最后一次请求返回的数据
        if (currentRequestId !== requestId) return;
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        dappExploreListEntity.setAll(state, action.payload);
      })
      .addCase(fetchDappExploreList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        dappExploreListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      })
      .addCase(fetchMoreDappExploreList.pending, (state, action) => {
        state.moreStatus = AsyncRequestStatus.PENDING;
        state.moreErrorMsg = '';
        state.noMore = false;
      })
      .addCase(fetchMoreDappExploreList.fulfilled, (state, action) => {
        state.moreStatus = AsyncRequestStatus.FULFILLED;
        state.moreErrorMsg = '';
        if (action.payload.length) {
          state.pageNumber += 1;
          dappExploreListEntity.addMany(state, action.payload);
        } else {
          state.noMore = true;
        }
      })
      .addCase(fetchMoreDappExploreList.rejected, (state, action) => {
        state.moreStatus = AsyncRequestStatus.REJECTED;
        state.moreErrorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = dappExploreListSlice;
export const { selectAll, selectById } = dappExploreListEntity.getSelectors(
  (state: RootState) => state.dappExploreList
);
export const selectState = (state: RootState) => state.dappExploreList;
export const { updateOne } = actions;
export default reducer;
