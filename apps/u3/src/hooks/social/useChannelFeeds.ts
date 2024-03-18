import { useCallback, useRef, useState } from 'react';
import { getFarcasterChannelFeeds } from 'src/services/social/api/farcaster';
import { FEEDS_PAGE_SIZE } from 'src/services/social/api/feeds';

import { toast } from 'react-toastify';
import { userDataObjFromArr } from '@/utils/social/farcaster/user-data';

export const getDefaultFarcasterWhatsnewCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    userData: {},
    userDataObj: {},
    endTimestamp: Date.now(),
    endCursor: '',
  };
};
type FarcasterWhatsnewCachedData = ReturnType<
  typeof getDefaultFarcasterWhatsnewCachedData
>;

type FarcasterWhatsnewOpts = {
  channelId?: string;
  cachedDataRefValue?: FarcasterWhatsnewCachedData;
};

// TODO useChannelFeeds 考虑合到 useFarcasterWhatsnew 逻辑中
export default function useChannelFeeds(opts?: FarcasterWhatsnewOpts) {
  const { channelId, cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultFarcasterWhatsnewCachedData(),
  });
  const farcasterWhatsnewData =
    cachedDataRefValue || defaultCachedDataRef.current;

  // TODO any
  const [farcasterWhatsnew, setFarcasterWhatsnew] = useState<any[]>(
    farcasterWhatsnewData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(farcasterWhatsnewData.pageInfo);

  const [farcasterWhatsnewUserDataObj, setFarcasterWhatsnewUserDataObj] =
    useState(farcasterWhatsnewData.userDataObj);

  const loadFarcasterWhatsnew = useCallback(async () => {
    if (pageInfo.hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterChannelFeeds({
        channelId,
        pageSize: FEEDS_PAGE_SIZE,
        endCursor: farcasterWhatsnewData.endCursor,
        endTimestamp: farcasterWhatsnewData.endTimestamp,
      });
      if (resp.data.code !== 0) {
        toast.error(`fail to get farcaster whatsnew ${resp.data.msg}`);
        setLoading(false);
        return;
      }
      const { data } = resp.data;

      const {
        data: casts,
        farcasterUserData,
        pageInfo: whatsnewPageInfo,
      } = data;

      if (casts.length > 0) {
        setFarcasterWhatsnew((pre) => [...pre, ...casts]);
        farcasterWhatsnewData.data = farcasterWhatsnewData.data.concat(casts);
      }
      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);

        setFarcasterWhatsnewUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        farcasterWhatsnewData.userDataObj = {
          ...farcasterWhatsnewData.userDataObj,
          ...userDataObj,
        };
      }

      setPageInfo(whatsnewPageInfo);
      farcasterWhatsnewData.pageInfo = whatsnewPageInfo;
      farcasterWhatsnewData.endCursor = whatsnewPageInfo.endCursor;
      farcasterWhatsnewData.endTimestamp = whatsnewPageInfo.endTimestamp;
    } catch (err) {
      console.error(err);
      toast.error('fail to get farcaster whatsnew');
    } finally {
      setLoading(false);
    }
  }, [pageInfo, channelId]);

  return {
    loading,
    loadFarcasterWhatsnew,
    farcasterWhatsnew,
    farcasterWhatsnewUserDataObj,
    pageInfo,
  };
}
