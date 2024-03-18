import { useCallback, useRef, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getFarcasterFollowing } from 'src/services/social/api/farcaster';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

export const getDefaultFarcasterFollowingCachedData = () => {
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
type FarcasterFollowingCachedData = ReturnType<
  typeof getDefaultFarcasterFollowingCachedData
>;
type FarcasterFollowingOpts = {
  cachedDataRefValue?: FarcasterFollowingCachedData;
};

export default function useFarcasterFollowing(opts?: FarcasterFollowingOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultFarcasterFollowingCachedData(),
  });
  const farcasterFollowingData =
    cachedDataRefValue || defaultCachedDataRef.current;

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
    if (pageInfo.hasNextPage === false) {
      return;
    }
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
  }, [currFid, pageInfo]);

  return {
    farcasterFollowing,
    loadFarcasterFollowing,
    loading,
    pageInfo,
    farcasterFollowingUserDataObj,
  };
}
