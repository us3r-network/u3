import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { getFarcasterTrending } from 'src/services/social/api/farcaster';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const PAGE_SIZE = 30;
const farcasterTrendingData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  index: 0,
};
const trendingIdSet: Set<string> = new Set();

export default function useFarcasterTrending() {
  const [farcasterTrending, setFarcasterTrending] = useState<any[]>(
    farcasterTrendingData.data
  ); // TODO any
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(farcasterTrendingData.pageInfo);

  const [farcasterTrendingUserDataObj, setFarcasterTrendingUserDataObj] =
    useState(farcasterTrendingData.userDataObj);

  const loadFarcasterTrending = useCallback(async () => {
    if (pageInfo.hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterTrending({
        start: farcasterTrendingData.index,
        end: farcasterTrendingData.index + PAGE_SIZE,
      });
      if (resp.data.code !== 0) {
        toast.error('fail to get farcaster trending');
        setLoading(false);
        return;
      }
      const { data } = resp.data;
      const { casts, farcasterUserData, pageInfo: trendingPageInfo } = data;
      const { endIndex } = trendingPageInfo;

      const newTrending = casts.filter((cast: any) => {
        const { id } = cast.data;
        if (trendingIdSet.has(id)) {
          return false;
        }
        trendingIdSet.add(id);
        return true;
      });

      if (newTrending.length > 0) {
        setFarcasterTrending((pre) => [...pre, ...newTrending]);
        farcasterTrendingData.data =
          farcasterTrendingData.data.concat(newTrending);
        farcasterTrendingData.index = endIndex;
      }
      if (farcasterUserData.length > 0) {
        const userDataObj = userDataObjFromArr(farcasterUserData);

        setFarcasterTrendingUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        farcasterTrendingData.userDataObj = {
          ...farcasterTrendingData.userDataObj,
          ...userDataObj,
        };
      }
      setPageInfo(trendingPageInfo);
      farcasterTrendingData.pageInfo = trendingPageInfo;
    } catch (err) {
      console.error(err);
      toast.error('fail to get farcaster trending');
    } finally {
      setLoading(false);
    }
  }, [pageInfo]);

  return {
    loading,
    farcasterTrending,
    farcasterTrendingUserDataObj,
    loadFarcasterTrending,
    pageInfo,
  };
}
