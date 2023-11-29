import { useCallback, useState } from 'react';
import { useLensCtx } from 'src/contexts/social/AppLensCtx';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getFollowingFeeds } from 'src/services/social/api/feeds';
import { SocialPlatform } from 'src/services/social/types';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const allFollowingData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  endFarcasterCursor: '',
  endLensCursor: '',
};

export default function useAllFollowing() {
  const { currFid } = useFarcasterCtx();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  // TODO any
  const [allFollowing, setAllFollowing] = useState<any[]>(
    allFollowingData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(allFollowingData.pageInfo);

  // TODO: remove
  const [allUserData, setAllUserData] = useState(allFollowingData.userData);
  const [allUserDataObj, setAllUserDataObj] = useState(
    allFollowingData.userDataObj
  );

  const loadAllFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getFollowingFeeds({
        lensProfileId: lensSessionProfileId,
        fid: `${currFid}`,
        platforms: [SocialPlatform.Farcaster, SocialPlatform.Lens],
        endFarcasterCursor: allFollowingData.endFarcasterCursor
          ? allFollowingData.endFarcasterCursor
          : undefined,
        endLensCursor: allFollowingData.endLensCursor
          ? allFollowingData.endLensCursor
          : undefined,
      });
      const {
        data,
        farcasterUserData,
        pageInfo: respPageInfo,
      } = resp.data.data;

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

      if (data.length > 0) {
        setAllFollowing((pre) => [...pre, ...data]);
        allFollowingData.data = allFollowingData.data.concat(data);
        // TODO: remove
        setAllUserData((pre) => ({ ...pre, ...temp }));
        allFollowingData.userData = {
          ...allFollowingData.userData,
          ...temp,
        };
        setAllUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        allFollowingData.userDataObj = {
          ...allFollowingData.userDataObj,
          ...userDataObj,
        };
      }
      setPageInfo(respPageInfo);
      allFollowingData.pageInfo = respPageInfo;
      allFollowingData.endFarcasterCursor = respPageInfo.endFarcasterCursor;
      allFollowingData.endLensCursor = respPageInfo.endLensCursor;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currFid]);

  return {
    allFollowing,
    loadAllFollowing,
    loading,
    pageInfo,
    allUserData,
    allUserDataObj,
  };
}
