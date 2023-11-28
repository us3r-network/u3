import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';
import { SocialPlatform } from 'src/services/social/types';
import { getTrendingFeeds } from 'src/services/social/api/feeds';

const PAGE_SIZE = 30;
export default function useLensTrending() {
  const index = useRef(0);

  const [lensTrending, setLensTrending] = useState<any[]>([]); // TODO any
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({});
  const lensAccessToken = useLensAccessToken();
  const loadLensTrending = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await getTrendingFeeds({
        // endLensCursor: pageInfo.endLensCursor,
        platforms: [SocialPlatform.Lens],
        lensAccessToken,
        keyword: '',
      });
      if (resp.data.code !== 0) {
        toast.error('fail to get trending trending');
        setLoading(false);
        return;
      }
      const { data } = resp.data;

      //   const { casts, farcasterUserData, pageInfo: trendingPageInfo } = data;
      //   const { endIndex } = trendingPageInfo;

      //   setPageInfo(trendingPageInfo);
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
    pageInfo,
  };
}
