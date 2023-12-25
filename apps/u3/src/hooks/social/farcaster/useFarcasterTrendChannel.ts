import { useEffect, useMemo, useState } from 'react';

import { getFarcasterChannelTrends } from 'src/services/social/api/farcaster';
import { FarcasterChannel } from './useFarcasterChannel';

export default function useFarcasterTrendChannel(
  farcasterChannels: FarcasterChannel[]
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [trendChannel, setTrendChannel] = useState<
    {
      parent_url: string;
      rootParentUrl: string;
      count: string;
      followerCount: string;
    }[]
  >([]);

  const loadTrendChannel = async () => {
    try {
      setLoading(true);
      const resp = await getFarcasterChannelTrends();
      if (resp.data.code !== 0) {
        console.error(resp.data.msg);
        setLoading(false);
        return;
      }
      setTrendChannel(resp.data.data.data);
    } finally {
      setLoading(false);
    }
  };

  const channels = useMemo(() => {
    return farcasterChannels
      .map((c) => {
        const trend = trendChannel.find(
          (t) =>
            t.parent_url === c.parent_url || t.rootParentUrl === c.parent_url
        );
        if (!trend)
          return {
            ...c,
            count: '0',
            followerCount: '0',
          };
        return {
          ...trend,
          ...c,
        };
      })
      .sort((a, b) => {
        return Number(b.count) - Number(a.count);
      });
  }, [trendChannel, farcasterChannels]);

  useEffect(() => {
    loadTrendChannel();
  }, []);

  return {
    channels,
    trendChannel,
    loading,
  };
}
