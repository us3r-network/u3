import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FarcasterPageInfo,
  getFarcasterChannelFeeds,
} from 'src/services/social/api/farcaster';
import { FEEDS_PAGE_SIZE } from 'src/services/social/api/feeds';

import { userDataObjFromArr } from '@/utils/social/farcaster/user-data';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function useChannelFeeds() {
  const { channelId } = useParams();
  const [mounted, setMounted] = useState(false);
  const { farcasterChannels } = useFarcasterCtx();
  const [feeds, setFeeds] = useState<{ [key: string]: any[] }>({});
  const [pageInfo, setPageInfo] = useState<FarcasterPageInfo>();
  const [farcasterUserDataObj, setFarcasterUserDataObj] = useState({});

  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const channel = useMemo(() => {
    const channelData = farcasterChannels.find(
      (c) => c.channel_id === channelId
    );
    return channelData;
  }, [channelId, farcasterChannels]);

  const loadChannelCasts = useCallback(async () => {
    if (!channel) return;
    if (feeds[channel.channel_id]?.length > 0) return;
    try {
      setFirstLoading(true);
      const resp = await getFarcasterChannelFeeds({
        channelId: channel.channel_id,
        pageSize: FEEDS_PAGE_SIZE,
      });
      if (resp.data.code !== 0) {
        console.error('loadChannelCasts error');
        return;
      }

      setFeeds((prev) => ({
        ...prev,
        [channel.channel_id]: resp.data.data.data,
      }));
      setPageInfo(resp.data.data.pageInfo);
      const userDataObj = userDataObjFromArr(resp.data.data.farcasterUserData);
      setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
    } catch (error) {
      console.error(error);
      setFeeds((prev) => ({ ...prev, [channel.channel_id]: [] }));
      setPageInfo(undefined);
      setFarcasterUserDataObj({});
    } finally {
      setFirstLoading(false);
    }
  }, [channel]);

  const loadMoreFeeds = useCallback(async () => {
    console.log('loadMoreFeeds');
    if (!channel) return;
    try {
      setMoreLoading(true);
      const resp = await getFarcasterChannelFeeds({
        channelId: channel.channel_id,
        pageSize: FEEDS_PAGE_SIZE,
        endCursor: pageInfo?.endCursor,
        endTimestamp: pageInfo?.endTimestamp,
      });
      if (resp.data.code !== 0) {
        console.error('loadChannelCasts error');
        return;
      }
      setFeeds((prev) => ({
        ...prev,
        [channel.channel_id]: [
          ...prev[channel.channel_id],
          ...resp.data.data.data,
        ],
      }));
      setPageInfo(resp.data.data.pageInfo);
      const userDataObj = userDataObjFromArr(resp.data.data.farcasterUserData);
      setFarcasterUserDataObj((pre) => ({ ...pre, ...userDataObj }));
    } catch (error) {
      console.error(error);
    } finally {
      setMoreLoading(false);
    }
  }, [pageInfo]);

  useEffect(() => {
    if (!mounted) return;
    loadChannelCasts();
  }, [mounted, loadChannelCasts]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const channelFeeds = useMemo(() => {
    if (!channel) return [];
    return feeds[channel.channel_id] || [];
  }, [feeds, channel]);

  return {
    firstLoading,
    moreLoading,
    loadFirstFeeds: loadChannelCasts,
    loadMoreFeeds,
    channel,
    feeds: channelFeeds,
    pageInfo,
    farcasterUserDataObj,
  };
}
