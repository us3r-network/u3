import { useCallback, useEffect, useState } from 'react';
import { getFarcasterLinks } from 'src/api/farcaster';

export default function useFarcasterFollowData({
  fid,
}: {
  fid?: string | number;
}) {
  const [loading, setLoading] = useState(false);
  const [farcasterFollowData, setFarcasterFollowData] = useState({
    followingCount: 0,
    followerCount: 0,
    followerData: [],
    followingData: [],
    farcasterUserData: {},
  });

  const getFarcasterFollowData = useCallback(async () => {
    if (!fid) return;
    const resp = await getFarcasterLinks(fid, true);
    const followData = resp.data.data;
    const temp: { [key: string]: { type: number; value: string }[] } = {};
    followData.farcasterUserData.forEach((item) => {
      if (temp[item.fid]) {
        temp[item.fid].push(item);
      } else {
        temp[item.fid] = [item];
      }
    });

    setFarcasterFollowData({
      ...followData,
      farcasterUserData: temp,
    });
  }, [fid]);

  useEffect(() => {
    setLoading(true);
    getFarcasterFollowData()
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [getFarcasterFollowData]);

  return {
    loading,
    farcasterFollowData,
  };
}
