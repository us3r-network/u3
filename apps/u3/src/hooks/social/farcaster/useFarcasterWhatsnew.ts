import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { getTrendingFeeds } from 'src/services/social/api/feeds';
import { SocialPlatform } from 'src/services/social/types';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const farcasterWhatsnewData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  index: '0',
};

export default function useFarcasterWhatsnew() {
  // TODO any
  const [farcasterWhatsnew, setFarcasterWhatsnew] = useState<any[]>(
    farcasterWhatsnewData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(farcasterWhatsnewData.pageInfo);

  const [farcasterWhatsnewUserDataObj, setFarcasterWhatsnewUserDataObj] =
    useState(farcasterWhatsnewData.userDataObj);

  const loadFarcasterWhatsnew = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getTrendingFeeds({
        endFarcasterCursor:
          farcasterWhatsnewData.index === '0'
            ? ''
            : farcasterWhatsnewData.index,
        platforms: [SocialPlatform.Farcaster],
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
      farcasterWhatsnewData.index = whatsnewPageInfo.endFarcasterCursor;
    } catch (err) {
      console.error(err);
      toast.error('fail to get  farcaster whatsnew');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    loadFarcasterWhatsnew,
    farcasterWhatsnew,
    farcasterWhatsnewUserDataObj,
    pageInfo,
  };
}
