import { useCallback, useEffect, useState } from 'react';
import { getFarcasterRecommendedProfile } from 'src/services/social/api/farcaster';

export default function useFarcasterRecommendedProfile({
  fid,
  num = 5,
}: {
  fid: string | number;
  num?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [farcasterRecommendedProfileData, setFarcasterFRecommendedProfileData] =
    useState({
      recommendedFids: [],
      farcasterUserData: {},
    });

  const getFarcasterRecommendedProfileData = useCallback(async () => {
    if (!fid) return;
    const resp = await getFarcasterRecommendedProfile(fid, num);
    const recommendedProfileData = resp.data.data;
    const temp: { [key: string]: { type: number; value: string }[] } = {};
    recommendedProfileData.farcasterUserData.forEach((item) => {
      if (temp[item.fid]) {
        temp[item.fid].push(item);
      } else {
        temp[item.fid] = [item];
      }
    });

    setFarcasterFRecommendedProfileData({
      ...recommendedProfileData,
      farcasterUserData: temp,
    });
  }, [fid, num]);

  useEffect(() => {
    setLoading(true);
    getFarcasterRecommendedProfileData()
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, [getFarcasterRecommendedProfileData]);

  return {
    loading,
    farcasterRecommendedProfileData,
  };
}
