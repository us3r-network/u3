import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';

import { getTrendingFeeds } from 'src/services/social/api/feeds';
import { SocialPlatform } from 'src/services/social/types';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const allWhatsnewData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  endFarcasterCursor: '',
  endLensCursor: '',
};

export default function useAllWhatsnew() {
  // TODO any
  const [allWhatsnew, setAllWhatsnew] = useState<any[]>(allWhatsnewData.data);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(allWhatsnewData.pageInfo);
  const [allUserDataObj, setAllUserDataObj] = useState(
    allWhatsnewData.userDataObj
  );
  const lensAccessToken = useLensAccessToken();
  const loadAllWhatsnew = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getTrendingFeeds({
        lensAccessToken,
        endFarcasterCursor: allWhatsnewData.endFarcasterCursor
          ? allWhatsnewData.endFarcasterCursor
          : undefined,
        endLensCursor: allWhatsnewData.endLensCursor
          ? allWhatsnewData.endLensCursor
          : undefined,
        platforms: [SocialPlatform.Farcaster, SocialPlatform.Lens],
        keyword: '',
      });
      if (resp.data.code !== 0) {
        toast.error('fail to get farcaster whatsnew');
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
        setAllWhatsnew((pre) => [...pre, ...casts]);
        allWhatsnewData.data = allWhatsnewData.data.concat(casts);
      }
      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);

        setAllUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        allWhatsnewData.userDataObj = {
          ...allWhatsnewData.userDataObj,
          ...userDataObj,
        };
      }

      setPageInfo(whatsnewPageInfo);
      allWhatsnewData.pageInfo = whatsnewPageInfo;
      allWhatsnewData.endFarcasterCursor = whatsnewPageInfo.endFarcasterCursor;
      allWhatsnewData.endLensCursor = whatsnewPageInfo.endLensCursor;
    } catch (err) {
      console.error(err);
      toast.error('fail to get  farcaster whatsnew');
    } finally {
      setLoading(false);
    }
  }, [lensAccessToken]);

  return {
    loading,
    loadAllWhatsnew,
    allWhatsnew,
    allUserDataObj,
    pageInfo,
  };
}
