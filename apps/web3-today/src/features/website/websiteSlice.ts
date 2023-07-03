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
} from '../../utils/event';

type WebsiteState = {
  u3ExtensionInstalled: boolean;
  eventCompleteGuideEnd: boolean;
  openEventCompleteGuideModal: boolean;
  eventCompleteGuideEndCallback: () => void;
};

// 站点状态信息
const websiteState: WebsiteState = {
  u3ExtensionInstalled: false,
  eventCompleteGuideEnd: verifyEventCompleteGuideEndByStore(),
  openEventCompleteGuideModal: false,
  eventCompleteGuideEndCallback: () => {},
};

export const websiteSlice = createSlice({
  name: 'website',
  initialState: websiteState,
  reducers: {
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
  },
});

const { actions, reducer } = websiteSlice;
export const {
  setU3ExtensionInstalled,
  setEventCompleteGuideEnd,
  setOpenEventCompleteGuideModal,
  setEventCompleteGuideEndCallback,
} = actions;
export const selectWebsite = (state: RootState) => state.website;
export default reducer;
