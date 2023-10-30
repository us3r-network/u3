/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 12:51:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-07 07:44:20
 * @Description: file description
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { AsyncRequestStatus } from '../../services/shared/types';
// import {
//   FrensEntity,
//   FrensExploreListItemResponse,
// } from '../../services/types/frens';
import type { RootState } from '../../store/store';
import {
  getFeed as getFeedApi,
  follower,
  following,
  search,
  follow,
  unFollow,
  reco,
  queryRss3,
} from '../../services/shared/api/frens';

// // 统一管理操作
// export type FrensHandle<T> = {
//   params: T | null;
//   status: AsyncRequestStatus;
//   errorMsg: string;
// };

export type FrensHandlesState = {
  feed: any;
  follower: any;
  following: any;
  reco: any;
  followingMap: any;
  isSearch: boolean;
  followAddressLoading: Array<string>;
  status: AsyncRequestStatus;
  followStatus: AsyncRequestStatus;
  errorMsg: string;
};

// init data
const initFrensHandlesState: FrensHandlesState = {
  feed: {
    total: null,
    cursor: null,
    result: null,
  },
  follower: null,
  following: null,
  followingMap: {},
  reco: null,
  followAddressLoading: [],
  isSearch: false,
  status: AsyncRequestStatus.IDLE,
  followStatus: AsyncRequestStatus.IDLE,
  errorMsg: '',
};

// favor frens
export const getFeed = createAsyncThunk(
  'user/frensHandles/favorFrens',
  async (
    {
      category,
      cursor,
      address,
      tag,
      reset = false,
      pageSize,
    }: {
      category?: string;
      cursor?: string;
      address?: string;
      tag?: string;
      reset?: boolean;
      pageSize?: number;
    },
    { dispatch }
  ) => {
    if (reset) dispatch(resetFeed({}));
    if (address) {
      const resp = await search({ cursor, address, tag });
      if (resp.data.code === 0) {
        dispatch(handleSearch(true));
        dispatch(getFeedSuccess({ data: resp?.data?.data, reset }));
      } else {
        throw new Error(resp.data.msg);
      }
    } else {
      dispatch(handleSearch(false));
      const resp = await getFeedApi({
        category,
        cursor,
        address,
        tag,
        page_size: pageSize || 10,
      });
      if (resp.data.code === 0) {
        dispatch(getFeedSuccess({ data: resp?.data?.data, reset }));
      } else {
        throw new Error(resp.data.msg);
      }
    }
  }
);

export const getRss3 = createAsyncThunk(
  'user/frensHandles/favorFrens',
  async (
    {
      address,
      cursor,
      tag,
      reset = false,
      pageSize,
    }: {
      cursor?: string;
      address: string[];
      tag?: string;
      reset?: boolean;
      pageSize?: number;
    },
    { dispatch }
  ) => {
    if (reset) dispatch(resetFeed({}));

    dispatch(handleSearch(false));
    const resp = await queryRss3({
      cursor,
      address,
      tag,
      pageSize,
    });
    if (resp.data.code === 0) {
      dispatch(getFeedSuccess({ data: resp?.data?.data, reset }));
    } else {
      throw new Error(resp.data.msg);
    }
  }
);

export const setFollow = createAsyncThunk(
  'user/frensHandles/getFollowing',
  async (
    {
      target,
      isFollow,
    }: {
      target: string;
      isFollow: boolean;
    },
    { dispatch }
  ) => {
    dispatch(setFollowAddressLoading({ isLoading: true, target }));

    if (isFollow) {
      await unFollow({ target });
      dispatch(getFollowing({ reset: true }));
      dispatch(setFollowAddressLoading({ isLoading: false, target }));
    } else {
      await follow({ target });
      dispatch(getFollowing({ reset: true }));
      dispatch(setFollowAddressLoading({ isLoading: false, target }));
    }
  }
);

export const getReco = createAsyncThunk(
  'user/frensHandles/getReco',
  async (params: any, { dispatch }) => {
    const resp = await reco({});
    if (resp.data.code === 0) {
      dispatch(getRecoSuccess(resp?.data?.data));
    } else {
      throw new Error(resp.data.msg);
    }
  }
);

// favor frens
export const getFollowing = createAsyncThunk(
  'user/frensHandles/getFollowing',
  async (
    {
      cursor,
      reset = false,
    }: {
      cursor?: string;
      reset?: boolean;
    },
    { dispatch }
  ) => {
    const resp = await following({ page_size: 100 });
    if (resp.data.code === 0) {
      dispatch(getFollowingSuccess({ data: resp?.data?.data, reset }));
    } else {
      throw new Error(resp.data.msg);
    }
  }
);
// favor frens
export const getFollower = createAsyncThunk(
  'user/frensHandles/getFollower',
  async (
    {
      cursor,
      reset = false,
    }: {
      cursor?: string;
      reset?: boolean;
    },
    { dispatch }
  ) => {
    const resp = await follower({ page_size: 100 });
    if (resp.data.code === 0) {
      dispatch(getFollowerSuccess({ data: resp?.data?.data, reset }));
    } else {
      throw new Error(resp.data.msg);
    }
  }
  // {
  //   condition: (params, { getState }) => {
  //     const state = getState() as RootState
  //     const {
  //       exploreSearchTasks: { status },
  //     } = state
  //     // 之前的请求正在进行中,则阻止新的请求
  //     if (status === AsyncRequestStatus.PENDING) {
  //       return false
  //     }
  //     return true
  //   },
  // },
);

export const frensHandlesSlice = createSlice({
  name: 'FrensHandles',
  initialState: initFrensHandlesState,
  reducers: {
    handleSearch: (state, action) => {
      state.isSearch = action?.payload;
    },
    setFollowAddressLoading: (state, action) => {
      const { isLoading, target } = action?.payload || {};
      const followAddressLoading = [...state.followAddressLoading];

      if (isLoading) {
        followAddressLoading.push(target);
      } else {
        const index = followAddressLoading.indexOf(target);
        if (index !== -1) followAddressLoading.splice(index, 1);
      }

      state.followAddressLoading = followAddressLoading;
    },
    getRecoSuccess: (state, action) => {
      state.reco = action?.payload;
    },
    getFollowingSuccess: (state, action) => {
      let result = action?.payload?.data?.result || [];
      if (!action?.payload?.reset) {
        result = [...(state?.following?.result || []), ...result];
      }

      state.following = {
        cursor: result?.[(result?.length || 1) - 1]?.owner,
        result,
        total: action?.payload?.data?.total,
      };
      state.followingMap = result?.reduce((acc, cur) => {
        acc[cur.owner] = cur?.owner_name;
        return acc;
      }, {});
    },
    getFollowerSuccess: (state, action) => {
      let result = action?.payload?.data?.result || [];
      if (!action?.payload?.reset) {
        result = [...(state?.follower?.result || []), ...result];
      }

      state.follower = {
        cursor: result?.[(result?.length || 1) - 1]?.owner,
        result,
        total: action?.payload?.data?.total,
      };
    },
    resetFeed: (state, action) => {
      state.feed = {
        total: null,
        cursor: null,
        result: null,
      };
    },
    getFeedSuccess: (state, action) => {
      let result = action?.payload?.data?.data?.result || [];
      if (!action?.payload?.reset) {
        result = [...(state?.feed?.result || []), ...result];
      }

      state.feed = {
        cursor: action?.payload?.data?.data?.cursor,
        result,
        total: action?.payload?.data?.data?.total,
      };
      // state.feed = action?.payload?.data?.data;

      // favorFrensQueueEntity.addOne(state.favorFrensQueue, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
      })
      .addCase(getFollowing.pending, (state, action) => {
        state.followStatus = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.followStatus = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.followStatus = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
      })
      .addCase(getFollower.pending, (state, action) => {
        state.followStatus = AsyncRequestStatus.PENDING;
        state.errorMsg = '';
      })
      .addCase(getFollower.fulfilled, (state, action) => {
        state.followStatus = AsyncRequestStatus.FULFILLED;
        state.errorMsg = '';
      })
      .addCase(getFollower.rejected, (state, action) => {
        state.followStatus = AsyncRequestStatus.REJECTED;
        state.errorMsg = action.error.message || '';
      });
  },
});

export const selectFrensHandlesState = (state: RootState) => state.frensHandles;

const { actions, reducer } = frensHandlesSlice;
const {
  getFeedSuccess,
  resetFeed,
  getFollowingSuccess,
  getFollowerSuccess,
  handleSearch,
  getRecoSuccess,
  setFollowAddressLoading,
} = actions;
export default reducer;
