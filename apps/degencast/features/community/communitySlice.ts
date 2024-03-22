import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store/store";
import { CommunityInfo } from "~/services/community/types/community";

type CommunityState = {
  browsingCommunity: CommunityInfo | null;
};

const communityState: CommunityState = {
  browsingCommunity: null,
};

export const communitySlice = createSlice({
  name: "community",
  initialState: communityState,
  reducers: {
    setBrowsingCommunity: (
      state: CommunityState,
      action: PayloadAction<CommunityInfo>
    ) => {
      state.browsingCommunity = action.payload;
    },
    clearBrowsingCommunity: (state: CommunityState) => {
      state.browsingCommunity = null;
    },
  },
});

const { actions, reducer } = communitySlice;
export const { setBrowsingCommunity, clearBrowsingCommunity } = actions;
export const selectCommunity = (state: RootState) => state.community;
export default reducer;
