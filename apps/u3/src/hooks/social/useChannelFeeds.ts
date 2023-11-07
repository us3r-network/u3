import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FarcasterPageInfo,
  getFarcasterChannelFeeds,
} from 'src/services/social/api/farcaster';
import { FEEDS_PAGE_SIZE } from 'src/services/social/api/feeds';
import { getChannel } from 'src/utils/social/farcaster/getChannel';

export default function useChannelFeeds() {
  const { channelId } = useParams();
  const [mounted, setMounted] = useState(false);

  const [feeds, setFeeds] = useState<{ [key: string]: any[] }>({});
  const [pageInfo, setPageInfo] = useState<FarcasterPageInfo>();
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[];
  }>({});

  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const channel = useMemo(() => {
    const channelData = getChannel().find((c) => c.channel_id === channelId);
    return channelData;
  }, [channelId]);

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
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      resp.data.data.farcasterUserData?.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterUserData(temp);
    } catch (error) {
      console.error(error);
      setFeeds((prev) => ({ ...prev, [channel.channel_id]: [] }));
      setPageInfo(undefined);
      setFarcasterUserData({});
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
        endFarcasterCursor: pageInfo?.endFarcasterCursor,
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
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      resp.data.data.farcasterUserData?.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      setFarcasterUserData((pre) => ({ ...pre, ...temp }));
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
    loadMoreFeeds,
    channel,
    feeds: channelFeeds,
    pageInfo,
    farcasterUserData,
  };
}
