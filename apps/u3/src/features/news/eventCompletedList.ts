/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-02 16:40:20
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-27 14:18:14
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { fetchListForEventComplete } from '../../services/news/api/event';
import { ApiRespCode, AsyncRequestStatus } from '../../services/shared/types';
import { EventExploreListItemResponse } from '../../services/news/types/event';
import type { RootState } from '../../store/store';

export type CompletedEventListItem = EventExploreListItemResponse;
type CompletedCommunityListState = EntityState<CompletedEventListItem> & {
  status: AsyncRequestStatus;
  moreStatus: AsyncRequestStatus;
  noMore: boolean;
  pageNumber: number;
  errorMsg: string;
  moreErrorMsg: string;
  currentRequestId: string; // 当前正在请求的id(由createAsyncThunk生成的唯一id)
};
const PAGE_SIZE = 20;
const PAGE_NUMBER_FIRST = 0;
export const eventCompletedListEntity =
  createEntityAdapter<CompletedEventListItem>({
    selectId: (item) => item.id,
  });
const initCompletedEventsState: CompletedCommunityListState =
  eventCompletedListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    moreStatus: AsyncRequestStatus.IDLE,
    noMore: false,
    pageNumber: PAGE_NUMBER_FIRST,
    errorMsg: '',
    moreErrorMsg: '',
    currentRequestId: '',
  });
export const fetchCompletedEvents = createAsyncThunk<
  Array<CompletedEventListItem>,
  undefined
>('event/user/completedList', async (params, { rejectWithValue }) => {
  const apiParams = {
    pageSize: PAGE_SIZE,
    pageNumber: PAGE_NUMBER_FIRST,
  };
  const resp = await fetchListForEventComplete(apiParams);
  if (resp.data.code === ApiRespCode.SUCCESS) {
    return resp.data.data.map((item) => ({
      ...item,
      id: item.isForU ? item.uuid : item.id,
    }));
  }
  return rejectWithValue(new Error(resp.data.msg));
});
// 获取更多
export const fetchMoreEventCompletedList = createAsyncThunk<
  Array<CompletedEventListItem>,
  undefined
>(
  'event/completed/page',
  async (params, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const { eventCompletedList } = state;
    const { pageNumber } = eventCompletedList;
    const apiParams = {
      pageSize: PAGE_SIZE,
      pageNumber: pageNumber + 1,
    };
    const resp = await fetchListForEventComplete(apiParams);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data.map((item) => ({
        ...item,
        id: item.isForU ? item.uuid : item.id,
      }));
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { eventCompletedList } = state;
      const { status, moreStatus } = eventCompletedList;
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

export const eventCompletedListSlice = createSlice({
  name: 'eventCompletedList',
  initialState: initCompletedEventsState,
  reducers: {
    addOne: (...args) => eventCompletedListEntity.addOne(...args),
    updateOne: (
      state,
      action: PayloadAction<Partial<CompletedEventListItem>>
    ) => {
      const updateData = action.payload;
      eventCompletedListEntity.updateOne(state, {
        id: updateData.id,
        changes: updateData,
      });
    },
    setOne: (...args) => eventCompletedListEntity.setOne(...args),
    removeOne: (...args) => eventCompletedListEntity.removeOne(...args),
    removeAll: (state) => eventCompletedListEntity.removeAll(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedEvents.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.pageNumber = 0;
        state.currentRequestId = action.meta.requestId;
        state.noMore = false;
      })
      .addCase(fetchCompletedEvents.fulfilled, (state, action) => {
        const { currentRequestId } = state;
        const { requestId } = action.meta;
        // 多个异步请求返回时，使用最后一次请求返回的数据
        if (currentRequestId !== requestId) return;
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        eventCompletedListEntity.setAll(state, action.payload);
      })
      .addCase(fetchCompletedEvents.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        eventCompletedListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      })
      .addCase(fetchMoreEventCompletedList.pending, (state, action) => {
        state.noMore = false;
        state.moreStatus = AsyncRequestStatus.PENDING;
        state.moreErrorMsg = '';
      })
      .addCase(fetchMoreEventCompletedList.fulfilled, (state, action) => {
        state.moreStatus = AsyncRequestStatus.FULFILLED;
        state.moreErrorMsg = '';
        if (action.payload.length) {
          state.pageNumber += 1;
          eventCompletedListEntity.addMany(state, action.payload);
        } else {
          state.noMore = true;
        }
      })
      .addCase(fetchMoreEventCompletedList.rejected, (state, action) => {
        state.moreStatus = AsyncRequestStatus.REJECTED;
        state.moreErrorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = eventCompletedListSlice;
export const { selectAll, selectById, selectIds } =
  eventCompletedListEntity.getSelectors(
    (state: RootState) => state.eventCompletedList
  );
export const selectState = (state: RootState) => state.eventCompletedList;
export const { addOne, updateOne, setOne, removeOne, removeAll } = actions;
export default reducer;
