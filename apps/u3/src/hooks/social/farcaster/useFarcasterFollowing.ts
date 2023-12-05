import { useCallback, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getFarcasterFollowing } from 'src/services/social/api/farcaster';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const farcasterFollowingData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  endTimestamp: Date.now(),
  endCursor: '',
};

export default function useFarcasterFollowing() {
  const { currFid } = useFarcasterCtx();
  const [farcasterFollowing, setFarcasterFollowing] = useState<any[]>(
    farcasterFollowingData.data
  ); // TODO any
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(farcasterFollowingData.pageInfo);

  const [farcasterFollowingUserDataObj, setFarcasterFollowingUserDataObj] =
    useState(farcasterFollowingData.userDataObj);

  const loadFarcasterFollowing = useCallback(async () => {
    if (!currFid) return;
    setLoading(true);
    try {
      const resp = await getFarcasterFollowing(
        currFid,
        farcasterFollowingData.endTimestamp,
        farcasterFollowingData.endCursor
      );
      const {
        casts: data,
        farcasterUserData,
        pageInfo: respPageInfo,
      } = resp.data.data;

      const userDataObj = userDataObjFromArr(farcasterUserData);

      if (data.length > 0) {
        setFarcasterFollowing((pre) => [...pre, ...data]);
        farcasterFollowingData.data = farcasterFollowingData.data.concat(data);

        setFarcasterFollowingUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        farcasterFollowingData.userDataObj = {
          ...farcasterFollowingData.userDataObj,
          ...userDataObj,
        };
      }
      setPageInfo(respPageInfo);
      farcasterFollowingData.pageInfo = respPageInfo;
      farcasterFollowingData.endCursor = respPageInfo.endCursor;
      farcasterFollowingData.endTimestamp = respPageInfo.endTimestamp;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currFid]);

  return {
    farcasterFollowing,
    loadFarcasterFollowing,
    loading,
    pageInfo,
    farcasterFollowingUserDataObj,
  };
}

export function resetFarcasterFollowingData() {
  farcasterFollowingData.data = [];
  farcasterFollowingData.pageInfo = {
    hasNextPage: true,
  };
  farcasterFollowingData.userData = {};
  farcasterFollowingData.userDataObj = {};
  farcasterFollowingData.endTimestamp = Date.now();
  farcasterFollowingData.endCursor = '';
}
