import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { JoinedCommunitiesData } from "~/services/community/api/community";

type JoinCommunityState = {
  joinedCommunities: JoinedCommunitiesData;
  joinedCommunitiesPending: boolean;
  joinActionPendingIds: Array<string | number>;
};

const joinCommunityState: JoinCommunityState = {
  joinedCommunities: [],
  joinedCommunitiesPending: false,
  joinActionPendingIds: [],
};

export const joinCommunitySlice = createSlice({
  name: "joinCommunity",
  initialState: joinCommunityState,
  reducers: {
    setJoinedCommunitiesPending: (
      state: JoinCommunityState,
      action: PayloadAction<boolean>
    ) => {
      state.joinedCommunitiesPending = action.payload;
    },
    setJoinedCommunities: (
      state: JoinCommunityState,
      action: PayloadAction<JoinedCommunitiesData>
    ) => {
      state.joinedCommunities = action.payload;
    },
    addOneToJoinedCommunities: (
      state: JoinCommunityState,
      action: PayloadAction<JoinedCommunitiesData[0]>
    ) => {
      state.joinedCommunities.unshift(action.payload);
    },
    removeOneFromJoinedCommunities: (
      state: JoinCommunityState,
      action: PayloadAction<string | number>
    ) => {
      state.joinedCommunities = state.joinedCommunities.filter(
        (item) => item.id !== action.payload
      );
    },
    addOneToJoinActionPendingIds: (
      state: JoinCommunityState,
      action: PayloadAction<string | number>
    ) => {
      state.joinActionPendingIds.unshift(action.payload);
    },
    removeOneFromJoinActionPendingIds: (
      state: JoinCommunityState,
      action: PayloadAction<string | number>
    ) => {
      state.joinActionPendingIds = state.joinActionPendingIds.filter(
        (id) => id !== action.payload
      );
    },
  },
});

const { actions, reducer } = joinCommunitySlice;
export const {
  setJoinedCommunitiesPending,
  setJoinedCommunities,
  addOneToJoinedCommunities,
  removeOneFromJoinedCommunities,
  addOneToJoinActionPendingIds,
  removeOneFromJoinActionPendingIds,
} = actions;
export const selectJoinCommunity = (state: RootState) => state.joinCommunity;
export default reducer;
