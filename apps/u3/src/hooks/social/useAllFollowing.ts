import { useCallback, useRef, useState } from 'react';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';
import { useLensCtx } from 'src/contexts/social/AppLensCtx';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';
import { getAllFollowing } from 'src/services/social/api/all';

export const getDefaultAllFollowingCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
      hasFarcasterNextPage: true,
      hasLensNextPage: true,
      endFarcasterCursor: '',
      endLensCursor: '',
    },
    userData: {},
    userDataObj: {},
    endTimestamp: Date.now(),
  };
};
type AllFollowingCachedData = ReturnType<
  typeof getDefaultAllFollowingCachedData
>;

type AllFollowingOpts = {
  channelId?: string;
  cachedDataRefValue?: AllFollowingCachedData;
};

export default function useAllFollowing(opts?: AllFollowingOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultAllFollowingCachedData(),
  });
  const allFollowingData = cachedDataRefValue || defaultCachedDataRef.current;

  const { currFid } = useFarcasterCtx();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  // TODO any
  const [allFollowing, setAllFollowing] = useState<any[]>(
    allFollowingData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(allFollowingData.pageInfo);

  const [allUserDataObj, setAllUserDataObj] = useState(
    allFollowingData.userDataObj
  );
  const lensAccessToken = useLensAccessToken();
  const loadAllFollowing = useCallback(
    async (more?: boolean) => {
      if (pageInfo.hasNextPage === false) {
        return;
      }
      setLoading(true);
      try {
        const resp = await getAllFollowing({
          lensAccessToken,
          lensProfileId: lensSessionProfileId,
          fid: currFid || undefined,
          endFarcasterCursor: pageInfo.endFarcasterCursor
            ? pageInfo.endFarcasterCursor
            : undefined,
          hasLensNextPage: pageInfo.hasLensNextPage,
          hasFarcasterNextPage: pageInfo.hasFarcasterNextPage,
          endTimestamp: allFollowingData.endTimestamp
            ? allFollowingData.endTimestamp
            : Date.now(),
          endLensCursor: pageInfo.endLensCursor
            ? pageInfo.endLensCursor
            : undefined,
        });
        const {
          data,
          farcasterUserData,
          pageInfo: respPageInfo,
        } = resp.data.data;

        if (data.length > 0) {
          if (more) {
            setAllFollowing((pre) => [...pre, ...data]);
            allFollowingData.data = allFollowingData.data.concat(data);
          } else {
            setAllFollowing([...data]);
            allFollowingData.data = [].concat(data);
          }

          const userDataObj = userDataObjFromArr(farcasterUserData);
          setAllUserDataObj((pre) => ({ ...pre, ...userDataObj }));
          allFollowingData.userDataObj = {
            ...allFollowingData.userDataObj,
            ...userDataObj,
          };
        }
        setPageInfo(respPageInfo);
        allFollowingData.pageInfo = respPageInfo;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [currFid, lensSessionProfileId, lensAccessToken, pageInfo]
  );

  return {
    allFollowing,
    loadAllFollowing,
    loading,
    pageInfo,
    allUserDataObj,
  };
}
