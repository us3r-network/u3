import { useCallback, useEffect, useState } from 'react';
import {
  getUserChannels,
  pinFarcasterChannel,
  unPinFarcasterChannel,
  getFarcasterChannels,
} from 'src/services/social/api/farcaster';

export type FarcasterChannel = {
  name: string;
  parent_url: string;
  image: string;
  channel_id: string;
  count?: string; // trendingCount
  followerCount?: string; // followerCount
};

export default function useFarcasterChannel({
  currFid,
}: {
  currFid: string | number;
}) {
  const [farcasterChannelsLoading, setFarcasterChannelsLoading] =
    useState(false);
  const [farcasterChannels, setFarcasterChannels] = useState<
    FarcasterChannel[]
  >([]);
  const [userChannels, setUserChannels] = useState<{ parent_url: string }[]>(
    []
  );
  const [mounted, setMounted] = useState(false);

  const getAllChannels = useCallback(async () => {
    try {
      setFarcasterChannelsLoading(true);
      const resp = await getFarcasterChannels();
      if (resp.data.code === 0) {
        const { channels } = resp.data.data;

        setFarcasterChannels(channels);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFarcasterChannelsLoading(false);
    }
  }, []);

  const getChannelFromId = useCallback(
    (id: string) => {
      const channel = farcasterChannels.find((c) => c.channel_id === id);
      if (channel) {
        return channel;
      }
      return null;
    },
    [farcasterChannels]
  );

  const getChannelFromUrl = useCallback(
    (url: string) => {
      const channel = farcasterChannels.find((c) => c.parent_url === url);
      if (channel) {
        return channel;
      }
      return null;
    },
    [farcasterChannels]
  );

  const getUserChannelsAction = useCallback(async () => {
    if (!currFid) return;
    try {
      const resp = await getUserChannels(currFid);
      if (resp.data.code === 0) {
        const channels = resp.data.data;
        setUserChannels(channels);
      }
    } catch (error) {
      console.error(error);
    }
  }, [currFid]);

  const joinChannel = useCallback(
    async (parent_url: string) => {
      if (!currFid) return;
      try {
        await pinFarcasterChannel(currFid, parent_url);
        await getUserChannelsAction();
      } catch (error) {
        console.error(error);
      }
    },
    [currFid]
  );

  const unPinChannel = useCallback(
    async (parent_url: string) => {
      if (!currFid) return;
      try {
        await unPinFarcasterChannel(currFid, parent_url);
        await getUserChannelsAction();
      } catch (error) {
        console.error(error);
      }
    },
    [currFid]
  );

  useEffect(() => {
    if (!mounted) return;
    getUserChannelsAction();
    getAllChannels();
  }, [mounted, getUserChannelsAction, getAllChannels]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    farcasterChannels,
    farcasterChannelsLoading,
    userChannels,
    getChannelFromUrl,
    getChannelFromId,
    getUserChannels: getUserChannelsAction,
    joinChannel,
    unPinChannel,
  };
}
