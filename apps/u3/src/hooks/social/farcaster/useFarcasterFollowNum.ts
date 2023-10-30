import { useCallback, useEffect, useState } from 'react';
import { getFarcasterFollow } from 'src/services/social/api/farcaster';

export default function useFarcasterFollowNum(fid: string) {
  const [farcasterFollowData, setFarcasterFollowData] = useState({
    following: 0,
    followers: 0,
  });

  const getFarcasterFollowData = useCallback(async () => {
    if (!fid) return;
    const resp = await getFarcasterFollow(fid);
    const followData = resp.data.data;
    setFarcasterFollowData({
      ...followData,
    });
  }, [fid]);

  useEffect(() => {
    getFarcasterFollowData().catch(console.error);
  }, [getFarcasterFollowData]);

  return {
    farcasterFollowData,
  };
}
