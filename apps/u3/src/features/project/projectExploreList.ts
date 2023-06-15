/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 18:54:42
 * @Description: file description
 */
import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { fetchListForProjectExplore } from '../../services/api/project';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import {
  ProjectExploreListItemResponse,
  ProjectExploreListParams,
} from '../../services/types/project';
import type { RootState } from '../../store/store';

export type ProjectExploreListItem = ProjectExploreListItemResponse;
type ProjectExploreListStore = EntityState<ProjectExploreListItem> & {
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
export const projectExploreListEntity =
  createEntityAdapter<ProjectExploreListItem>({
    selectId: (item) => item.id,
  });
const initTodoTasksState: ProjectExploreListStore =
  projectExploreListEntity.getInitialState({
    status: AsyncRequestStatus.IDLE,
    moreStatus: AsyncRequestStatus.IDLE,
    noMore: false,
    pageNumber: PAGE_NUMBER_FIRST,
    errorMsg: '',
    moreErrorMsg: '',
    currentRequestId: '',
  });
// 重新获取列表
export const fetchProjectExploreList = createAsyncThunk<
  Array<ProjectExploreListItem>,
  ProjectExploreListParams
>('project/explore/list', async (params, { rejectWithValue }) => {
  const resp = await fetchListForProjectExplore({
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
export const fetchMoreProjectExploreList = createAsyncThunk<
  Array<ProjectExploreListItem>,
  ProjectExploreListParams
>(
  'project/explore/page',
  async (params, { rejectWithValue, getState }) => {
    const state = getState() as RootState;
    const { projectExploreList } = state;
    const { pageNumber } = projectExploreList;
    const resp = await fetchListForProjectExplore({
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
      const { projectExploreList } = state;
      const { status, moreStatus } = projectExploreList;
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

export const projectExploreListSlice = createSlice({
  name: 'projectExploreList',
  initialState: initTodoTasksState,
  reducers: {
    updateOne: (
      state,
      action: PayloadAction<Partial<ProjectExploreListItem>>
    ) => {
      const updateData = action.payload;
      projectExploreListEntity.updateOne(state, {
        id: updateData.id,
        changes: updateData,
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectExploreList.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
        state.pageNumber = 0;
        state.currentRequestId = action.meta.requestId;
        state.noMore = false;
      })
      .addCase(fetchProjectExploreList.fulfilled, (state, action) => {
        const { currentRequestId } = state;
        const { requestId } = action.meta;
        // 多个异步请求返回时，使用最后一次请求返回的数据
        if (currentRequestId !== requestId) return;
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
        projectExploreListEntity.setAll(state, action.payload);
      })
      .addCase(fetchProjectExploreList.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        projectExploreListEntity.setAll(state, []);
        state.errorMsg = action.error.message || '';
      })
      .addCase(fetchMoreProjectExploreList.pending, (state, action) => {
        state.moreStatus = AsyncRequestStatus.PENDING;
        state.moreErrorMsg = '';
        state.noMore = false;
      })
      .addCase(fetchMoreProjectExploreList.fulfilled, (state, action) => {
        state.moreStatus = AsyncRequestStatus.FULFILLED;
        state.moreErrorMsg = '';
        if (action.payload.length) {
          state.pageNumber += 1;
          projectExploreListEntity.addMany(state, action.payload);
        } else {
          state.noMore = true;
        }
      })
      .addCase(fetchMoreProjectExploreList.rejected, (state, action) => {
        state.moreStatus = AsyncRequestStatus.REJECTED;
        state.moreErrorMsg = action.error.message || '';
      });
  },
});

const { actions, reducer } = projectExploreListSlice;
export const { selectAll, selectById } = projectExploreListEntity.getSelectors(
  (state: RootState) => state.projectExploreList
);
export const selectState = (state: RootState) => state.projectExploreList;
export const { updateOne } = actions;
export default reducer;
