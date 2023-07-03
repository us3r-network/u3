/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 17:55:15
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:41:48
 * @Description: file description
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getConfigsTopics } from '../../services/api/common';
import { ApiRespCode, AsyncRequestStatus } from '../../services/types';
import {
  ConfigTopicsChain,
  ConfigTopicsType,
} from '../../services/types/common';
import type { RootState } from '../../store/store';
import { formatFilterShowName } from '../../utils/filter';

export type TopicItem = {
  value: string;
  name: string;
  image?: string;
};
type Topics = {
  eventRewards: TopicItem[];
  eventTypes: TopicItem[];
  contentTypes: TopicItem[];
  langs: TopicItem[];
  chains: ConfigTopicsChain[];
  contentTags: TopicItem[];
};
type ConfigsTopicsState = {
  status: AsyncRequestStatus;
  topics: Topics;
};
const initConfigsTopicsState: ConfigsTopicsState = {
  status: AsyncRequestStatus.IDLE,
  topics: {
    eventRewards: [],
    eventTypes: [],
    contentTypes: [],
    langs: [],
    chains: [],
    contentTags: [],
  },
};

const formatTopics = (topics: string[]) => {
  return topics.map((item) => ({
    value: item,
    name: formatFilterShowName(item),
  }));
};
const formatTypeTopics = (topics: ConfigTopicsType[]) => {
  return topics.map((item) => ({
    ...item,
    value: item.name,
    name: formatFilterShowName(item.name),
  }));
};
export const fetchConfigsTopics = createAsyncThunk<Topics, undefined>(
  'configs/topics',
  async (params, { rejectWithValue }) => {
    const resp = await getConfigsTopics();
    if (resp.data.code === ApiRespCode.SUCCESS) {
      const { eventRewards, eventTypes, contentTypes, langs, contentTags } =
        resp.data.data;
      return {
        ...resp.data.data,
        eventRewards: formatTypeTopics(eventRewards || []),
        eventTypes: formatTypeTopics(eventTypes || []),
        contentTypes: formatTopics(contentTypes || []),
        langs: formatTopics(langs || []),
        contentTags: formatTypeTopics(contentTags || []),
      };
    }
    return rejectWithValue(new Error(resp.data.msg));
  },
  {
    condition: (params, { getState }) => {
      const state = getState() as RootState;
      const { configsTopics } = state;
      const { status } = configsTopics;
      // 之前的请求正在进行中,则阻止新的请求
      if (status === AsyncRequestStatus.PENDING) {
        return false;
      }
      return true;
    },
  }
);

export const configsTopicsSlice = createSlice({
  name: 'configsTopics',
  initialState: initConfigsTopicsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigsTopics.pending, (state, action) => {
        state.status = AsyncRequestStatus.PENDING;
      })
      .addCase(fetchConfigsTopics.fulfilled, (state, action) => {
        state.status = AsyncRequestStatus.FULFILLED;
        state.topics = action.payload;
      })
      .addCase(fetchConfigsTopics.rejected, (state, action) => {
        state.status = AsyncRequestStatus.REJECTED;
      });
  },
});

const { reducer } = configsTopicsSlice;
export const selectState = (state: RootState) => state.configsTopics;
export default reducer;
