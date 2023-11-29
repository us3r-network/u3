import { useCallback, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getFollowingFeeds } from 'src/services/social/api/feeds';
import { SocialPlatform } from 'src/services/social/types';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

const farcasterFollowingData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  userData: {},
  userDataObj: {},
  index: '',
};

export default function useFarcasterFollowing() {
  const { currFid } = useFarcasterCtx();
  const [farcasterFollowing, setFarcasterFollowing] = useState<any[]>(
    farcasterFollowingData.data
  ); // TODO any
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(farcasterFollowingData.pageInfo);

  // TODO: remove
  const [farcasterFollowingUserData, setFarcasterFollowingUserData] = useState(
    farcasterFollowingData.userData
  );
  const [farcasterFollowingUserDataObj, setFarcasterFollowingUserDataObj] =
    useState(farcasterFollowingData.userDataObj);

  const loadFarcasterFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getFollowingFeeds({
        fid: `${currFid}`,
        platforms: [SocialPlatform.Farcaster],
        endFarcasterCursor: farcasterFollowingData.index
          ? farcasterFollowingData.index
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
        setFarcasterFollowing((pre) => [...pre, ...data]);
        farcasterFollowingData.data = farcasterFollowingData.data.concat(data);
        // TODO: remove
        setFarcasterFollowingUserData((pre) => ({ ...pre, ...temp }));
        farcasterFollowingData.userData = {
          ...farcasterFollowingData.userData,
          ...temp,
        };
        setFarcasterFollowingUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        farcasterFollowingData.userDataObj = {
          ...farcasterFollowingData.userDataObj,
          ...userDataObj,
        };
        farcasterFollowingData.index = respPageInfo.endFarcasterCursor;
      }
      setPageInfo(respPageInfo);
      farcasterFollowingData.pageInfo = respPageInfo;
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
    farcasterFollowingUserData,
    farcasterFollowingUserDataObj,
  };
}
