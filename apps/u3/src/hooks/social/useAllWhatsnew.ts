import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
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
  const [allUserData, setAllUserData] = useState(allWhatsnewData.userData);
  const [allUserDataObj, setAllUserDataObj] = useState(
    allWhatsnewData.userDataObj
  );

  const loadAllWhatsnew = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getTrendingFeeds({
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
        // TODO: remove
        const temp: { [key: string]: { type: number; value: string }[] } = {};
        farcasterUserData?.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        const userDataObj = userDataObjFromArr(farcasterUserData);
        // TODO: remove
        setAllUserData((pre) => ({ ...pre, ...temp }));
        allWhatsnewData.userData = {
          ...allWhatsnewData.userData,
          ...temp,
        };

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
  }, []);

  return {
    loading,
    loadAllWhatsnew,
    allWhatsnew,
    allUserData,
    allUserDataObj,
    pageInfo,
  };
}
