import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';
import { SocialPlatform } from 'src/services/social/types';
import { getTrendingFeeds } from 'src/services/social/api/feeds';

const lensTrendingData = {
  data: [],
  pageInfo: {
    hasNextPage: true,
  },
  endLensCursor: '',
};
export default function useLensTrending() {
  const index = useRef(0);

  // TODO any
  const [lensTrending, setLensTrending] = useState<any[]>(
    lensTrendingData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(lensTrendingData.pageInfo);
  const lensAccessToken = useLensAccessToken();
  const loadLensTrending = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getTrendingFeeds({
        endLensCursor: lensTrendingData.endLensCursor
          ? lensTrendingData.endLensCursor
          : undefined,
        platforms: [SocialPlatform.Lens],
        lensAccessToken,
      });
      if (resp.data.code !== 0) {
        toast.error('fail to get trending trending');
        setLoading(false);
        return;
      }
      const { data, pageInfo: respPageInfo } = resp.data.data;
      if (data.length > 0) {
        setLensTrending((pre) => [...pre, ...data]);
        lensTrendingData.data = lensTrendingData.data.concat(data);
      }
      if (respPageInfo) {
        lensTrendingData.endLensCursor = respPageInfo.endLensCursor;
        setPageInfo(respPageInfo);
      }
    } catch (err) {
      console.error(err);
      toast.error('fail to get trending trending');
    } finally {
      setLoading(false);
    }
  }, [index]);

  return {
    loading,
    loadLensTrending,
    lensTrending,
    pageInfo,
  };
}
