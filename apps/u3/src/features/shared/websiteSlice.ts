/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-30 18:51:51
 * @Description: 站点的配置
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';
import {
  setEventCompleteGuideEndToStore,
  verifyEventCompleteGuideEndByStore,
} from '../../utils/news/event';
import {
  setHomeBannerHiddenToStore,
  verifyHomeBannerHiddenByStore,
} from '../../utils/shared/homeStore';
import { FeedsType } from '../../components/profile/ProfilePageNav';

type WebsiteState = {
  mobileNavDisplay: boolean;
  u3ExtensionInstalled: boolean;
  eventCompleteGuideEnd: boolean;
  openEventCompleteGuideModal: boolean;
  eventCompleteGuideEndCallback: () => void;
  homeBannerDisplay: boolean;
  profilePageFeedsType: FeedsType;
};

// 站点状态信息
const websiteState: WebsiteState = {
  mobileNavDisplay: true,
  u3ExtensionInstalled: false,
  eventCompleteGuideEnd: verifyEventCompleteGuideEndByStore(),
  openEventCompleteGuideModal: false,
  eventCompleteGuideEndCallback: () => {},
  homeBannerDisplay: !verifyHomeBannerHiddenByStore(),
  profilePageFeedsType: FeedsType.POSTS,
};

export const websiteSlice = createSlice({
  name: 'website',
  initialState: websiteState,
  reducers: {
    setMobileNavDisplay: (state, action: PayloadAction<boolean>) => {
      state.mobileNavDisplay = action.payload;
    },
    setU3ExtensionInstalled: (state, action: PayloadAction<boolean>) => {
      state.u3ExtensionInstalled = action.payload;
    },
    setEventCompleteGuideEnd: (state) => {
      state.eventCompleteGuideEnd = true;
      state.openEventCompleteGuideModal = false;
      setEventCompleteGuideEndToStore();
    },
    setOpenEventCompleteGuideModal: (state, action: PayloadAction<boolean>) => {
      state.openEventCompleteGuideModal = action.payload;
    },
    setEventCompleteGuideEndCallback: (
      state,
      action: PayloadAction<() => void>
    ) => {
      state.eventCompleteGuideEndCallback = action.payload;
    },
    setHomeBannerHidden: (state) => {
      state.homeBannerDisplay = false;
      setHomeBannerHiddenToStore();
    },
    setProfilePageFeedsType: (state, action: PayloadAction<FeedsType>) => {
      state.profilePageFeedsType = action.payload;
    },
  },
});

const { actions, reducer } = websiteSlice;
export const {
  setMobileNavDisplay,
  setU3ExtensionInstalled,
  setEventCompleteGuideEnd,
  setOpenEventCompleteGuideModal,
  setEventCompleteGuideEndCallback,
  setHomeBannerHidden,
  setProfilePageFeedsType,
} = actions;
export const selectWebsite = (state: RootState) => state.website;
export default reducer;
