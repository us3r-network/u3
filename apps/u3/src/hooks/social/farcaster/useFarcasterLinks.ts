import { useCallback, useEffect, useState } from 'react';
import { debounce, uniqBy } from 'lodash';
import {
  FarcasterLink,
  PAGE_SIZE,
  getFarcasterUserLinks,
} from '@/services/social/api/farcaster';
import { FollowType } from '@/container/profile/Contacts';

export default function useFarcasterLinks({
  fid,
  pageSize,
  type,
}: {
  fid: string | number;
  pageSize?: number;
  type: FollowType;
}) {
  const [links, setLinks] = useState<FarcasterLink[]>([]);
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[];
  }>({});
  const [hasMore, setHasMore] = useState(false);
  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [endCursor, setEndCursor] = useState('');

  const loadMore = useCallback(async () => {
    if (moreLoading || !hasMore) {
      return;
    }
    if (!fid) return;
    if (!pageSize) pageSize = PAGE_SIZE;
    setMoreLoading(true);
    try {
      const resp = await getFarcasterUserLinks({
        fid,
        type,
        pageSize,
        endCursor,
      });
      const {
        links: newLinks,
        pageInfo,
        farcasterUserData: userData,
      } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      userData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      switch (type) {
        case FollowType.FOLLOWER:
          setLinks(uniqBy([...links, ...newLinks], 'fid'));
          break;
        case FollowType.FOLLOWING:
          setLinks(uniqBy([...links, ...newLinks], 'targetFid'));
          break;
        default:
          break;
      }
      setFarcasterUserData({ ...farcasterUserData, ...temp });
      if (pageInfo) {
        setHasMore(pageInfo.hasNextPage);
        setEndCursor(pageInfo.endCursor);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setMoreLoading(false);
    }
  }, [moreLoading, hasMore, endCursor, links, farcasterUserData, fid]);

  const load = async () => {
    if (firstLoading) return;
    if (!fid) return;
    setFirstLoading(true);
    try {
      const resp = await getFarcasterUserLinks({
        fid,
        type,
        pageSize,
      });
      if (!resp?.data?.data) return;
      const {
        links: newLinks,
        pageInfo,
        farcasterUserData: userData,
      } = resp.data.data;
      const temp: { [key: string]: { type: number; value: string }[] } = {};
      userData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item);
        } else {
          temp[item.fid] = [item];
        }
      });
      switch (type) {
        case FollowType.FOLLOWER:
          setLinks(uniqBy(newLinks, 'fid'));
          break;
        case FollowType.FOLLOWING:
          setLinks(uniqBy(newLinks, 'targetFid'));
          break;
        default:
          break;
      }
      setFarcasterUserData({ ...farcasterUserData, ...temp });
      if (pageInfo) {
        setHasMore(pageInfo.hasNextPage);
        setEndCursor(pageInfo.endCursor);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFirstLoading(false);
    }
  };

  useEffect(() => {
    debounce(load, 500)();
  }, [fid]);

  return {
    firstLoading,
    moreLoading,
    hasMore,
    links,
    farcasterUserData,
    loadMore,
  };
}
