import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getFarcasterTrending } from 'src/services/social/api/farcaster';

const PAGE_SIZE = 30;
export default function useFarcasterTrending() {
  const index = useRef(0);
  const trendingIdSet = useRef<Set<string>>(new Set());
  const [farcasterTrending, setFarcasterTrending] = useState<any[]>([]); // TODO any
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const [farcasterTrendingUserData, setFarcasterTrendingUserData] = useState(
    {}
  );

  const loadFarcasterTrending = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getFarcasterTrending({
        start: index.current,
        end: index.current + PAGE_SIZE,
      });
      if (resp.data.code !== 0) {
        toast.error('fail to get farcaster trending');
        setLoading(false);
        return;
      }
      const { data } = resp.data;
      const { casts, farcasterUserData, pageInfo: trendingPageInfo } = data;
      const { endIndex } = trendingPageInfo;

      const newTrending = casts.filter((cast: any) => {
        const { id } = cast.data;
        if (trendingIdSet.current.has(id)) {
          return false;
        }
        trendingIdSet.current.add(id);
        return true;
      });

      if (newTrending.length > 0) {
        setFarcasterTrending((pre) => [...pre, ...newTrending]);
        index.current = endIndex;
      }
      if (farcasterUserData.length > 0) {
        const temp: { [key: string]: { type: number; value: string }[] } = {};
        farcasterUserData?.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        setFarcasterTrendingUserData((pre) => ({ ...pre, ...temp }));
      }
      setPageInfo(trendingPageInfo);
    } catch (err) {
      console.error(err);
      toast.error('fail to get farcaster trending');
    } finally {
      setLoading(false);
    }
  }, [index]);

  return {
    loading,
    farcasterTrending,
    farcasterTrendingUserData,
    loadFarcasterTrending,
    pageInfo,
  };
}
