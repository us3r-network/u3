import { useCallback, useEffect, useState } from 'react';
import { getFarcasterFollow } from 'src/api/farcaster';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';

export default function useFarcasterFollowNum() {
  const { currFid } = useFarcasterCtx();
  const [farcasterFollowData, setFarcasterFollowData] = useState({
    following: 0,
    followers: 0,
  });

  const getFarcasterFollowData = useCallback(async () => {
    if (!currFid) return;
    const resp = await getFarcasterFollow(currFid);
    const followData = resp.data.data;
    setFarcasterFollowData({
      ...followData,
    });
  }, [currFid]);

  useEffect(() => {
    getFarcasterFollowData().catch(console.error);
  }, [getFarcasterFollowData]);

  return {
    farcasterFollowData,
  };
}
