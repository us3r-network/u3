import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { getFarcasterWhatsnew } from 'src/services/social/api/farcaster';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const farcasterWhatsnewData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  endTimestamp: Date.now(),
  endCursor: '',
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
    if (pageInfo.hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getFarcasterWhatsnew(
        farcasterWhatsnewData.endTimestamp,
        farcasterWhatsnewData.endCursor
      );
      if (resp.data.code !== 0) {
        toast.error(`fail to get farcaster whatsnew ${resp.data.msg}`);
        setLoading(false);
        return;
      }
      const { data } = resp.data;

      const { casts, farcasterUserData, pageInfo: whatsnewPageInfo } = data;

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
  }, [pageInfo]);

  return {
    loading,
    loadFarcasterWhatsnew,
    farcasterWhatsnew,
    farcasterWhatsnewUserDataObj,
    pageInfo,
  };
}
