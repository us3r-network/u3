import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  dailyCheckIn,
  getKarma,
  getKarmaList,
} from '../../services/api/profile';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import { KarmaListItem } from '../../services/types/profile';
import type { RootState } from '../../store/store';

type KarmaState = {
  status: AsyncRequestStatus;
  score: number;
  totalScore: number;
  checked: boolean;
  seqCnt: number;
  listStatus: AsyncRequestStatus;
  loadMoreStatus: AsyncRequestStatus;
  list: Array<KarmaListItem>;
  transList: Array<any>;
  pageNumber: number;
  pageSize: number;
  hasMore: boolean;
};

const initKarmaState: KarmaState = {
  status: AsyncRequestStatus.IDLE,
  score: 0,
  checked: true,
  totalScore: 0,
  seqCnt: 0,
  listStatus: AsyncRequestStatus.IDLE,
  loadMoreStatus: AsyncRequestStatus.IDLE,
  pageNumber: 0,
  pageSize: 10,
  list: [],
  transList: [],
  hasMore: false,
};

export const SCORE = {
  SubmitContent: 1,
  ApplaudContent: 1,
};

export const fetchUserKarma = createAsyncThunk(
  'profile/userKarma',
  async ({ token }: { token: string }, { rejectWithValue }) => {
    const resp = await getKarma(token);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const fetchUserKarmaList = createAsyncThunk(
  'profile/userKarmaList',
  async (
    {
      pageNumber,
      pageSize,
      token,
    }: { pageSize?: number; pageNumber?: number; token: string },
    { rejectWithValue }
  ) => {
    const resp = await getKarmaList({ pageNumber, pageSize }, token);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const fetchUserKarmaListMore = createAsyncThunk(
  'profile/userKarmaListMore',
  async (
    {
      pageNumber,
      pageSize,
      token,
    }: { pageNumber: number; pageSize: number; token: string },
    { rejectWithValue }
  ) => {
    const resp = await getKarmaList({ pageNumber, pageSize }, token);
    if (resp.data.code === ApiRespCode.SUCCESS) {
      return resp.data.data;
    }
    return rejectWithValue(new Error(resp.data.msg));
  }
);

export const checkIn = createAsyncThunk(
  'profile/checkIn',
  async ({ token }: { token: string }, thunkAPI) => {
    const resp = await dailyCheckIn(token);
    thunkAPI.dispatch(fetchUserKarmaList({ token }));
    return resp.data.data;
  }
);

export const karmaSlice = createSlice({
  name: 'karma',
  initialState: initKarmaState,
  reducers: {
    incScore: (state, action) => {
      state.totalScore += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserKarma.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchUserKarma.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.totalScore = action.payload.totalScore;
        state.score = action.payload.score;
        state.checked = action.payload.checked;
        state.seqCnt = action.payload.seqCnt;
      })
      .addCase(fetchUserKarma.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      })

      .addCase(checkIn.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.totalScore = action.payload.totalScore;
        state.score = action.payload.score;
        state.checked = true;
        state.seqCnt = action.payload.seqCnt;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      })
      .addCase(fetchUserKarmaList.pending, (state, action) => {
        state.listStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchUserKarmaList.fulfilled, (state, action) => {
        state.listStatus = AsyncRequestStatus.FULFILLED;
        state.list = action.payload.list;
        state.hasMore = action.payload.list.length > action.meta.arg.pageSize;
      })
      .addCase(fetchUserKarmaList.rejected, (state, action) => {
        state.listStatus = AsyncRequestStatus.REJECTED;
      })
      .addCase(fetchUserKarmaListMore.pending, (state, action) => {
        state.loadMoreStatus = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchUserKarmaListMore.fulfilled, (state, action) => {
        state.loadMoreStatus = AsyncRequestStatus.FULFILLED;
        state.list = [...state.list, ...action.payload.list];
        state.pageNumber = action.meta.arg.pageNumber;
        state.hasMore = action.payload.list.length > action.meta.arg.pageSize;
      })
      .addCase(fetchUserKarmaListMore.rejected, (state, action) => {
        state.loadMoreStatus = AsyncRequestStatus.REJECTED;
      });
  },
});

const { reducer, actions } = karmaSlice;
export const selectKarmaState = (state: RootState) => state.karma;

export const { incScore } = actions;

export default reducer;
