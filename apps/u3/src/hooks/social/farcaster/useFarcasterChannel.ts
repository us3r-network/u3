import { useCallback, useEffect, useState } from 'react';
import {
  getUserChannels,
  pinFarcasterChannel,
  unPinFarcasterChannel,
} from 'src/services/social/api/farcaster';

export default function useFarcasterChannel({
  currFid,
}: {
  currFid: string | number;
}) {
  const [userChannels, setUserChannels] = useState<{ parent_url: string }[]>(
    []
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
    getUserChannelsAction();
  }, [getUserChannelsAction]);

  return {
    userChannels,
    getUserChannels: getUserChannelsAction,
    joinChannel,
    unPinChannel,
  };
}
