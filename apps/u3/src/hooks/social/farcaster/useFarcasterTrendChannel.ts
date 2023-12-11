import { useEffect, useMemo, useState } from 'react';
import { getFarcasterChannelTrends } from 'src/services/social/api/farcaster';
import FarcasterChannelData from '../../../constants/warpcast.json';

export default function useFarcasterTrendChannel() {
  const [trendChannel, setTrendChannel] = useState<
    {
      parent_url: string;
      rootParentUrl: string;
      count: string;
    }[]
  >([]);

  const loadTrendChannel = async () => {
    const resp = await getFarcasterChannelTrends();
    if (resp.data.code !== 0) {
      console.error(resp.data.msg);
      return;
    }
    setTrendChannel(resp.data.data.data);
  };

  const channels = useMemo(() => {
    return FarcasterChannelData.map((c) => {
      const trend = trendChannel.find(
        (t) => t.parent_url === c.parent_url || t.rootParentUrl === c.parent_url
      );
      if (!trend)
        return {
          ...c,
          count: '0',
        };
      return {
        ...trend,
        ...c,
      };
    }).sort((a, b) => {
      return Number(b.count) - Number(a.count);
    });
  }, [trendChannel]);

  useEffect(() => {
    loadTrendChannel();
  }, []);

  return {
    channels,
    trendChannel,
  };
}
