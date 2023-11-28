import { useCallback, useRef, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getFollowingFeeds } from 'src/services/social/api/feeds';
import { SocialPlatform } from 'src/services/social/types';
import { userDataObjFromArr } from 'src/utils/social/farcaster/user-data';

export default function useFarcasterFollowing() {
  const index = useRef('');
  const { currFid } = useFarcasterCtx();
  const [farcasterFollowing, setFarcasterFollowing] = useState<any[]>([]); // TODO any
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({});

  // TODO: remove
  const [farcasterFollowingUserData, setFarcasterFollowingUserData] = useState(
    {}
  );
  const [farcasterFollowingUserDataObj, setFarcasterFollowingUserDataObj] =
    useState({});

  const loadFarcasterFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getFollowingFeeds({
        fid: `${currFid}`,
        platforms: [SocialPlatform.Farcaster],
        endFarcasterCursor: index.current ? index.current : undefined,
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
        // TODO: remove
        setFarcasterFollowingUserData((pre) => ({ ...pre, ...temp }));
        setFarcasterFollowingUserDataObj((pre) => ({ ...pre, ...userDataObj }));
        index.current = respPageInfo.endFarcasterCursor;
      }
      setPageInfo(respPageInfo);
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
