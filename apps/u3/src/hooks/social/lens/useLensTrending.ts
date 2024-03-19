import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';
import { getLensTrending } from 'src/services/social/api/lens';

export const getDefaultLensTrendingCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    endLensCursor: '',
  };
};
type LensTrendingCachedData = ReturnType<
  typeof getDefaultLensTrendingCachedData
>;

type LensTrendingOpts = {
  cachedDataRefValue?: LensTrendingCachedData;
};
export default function useLensTrending(opts?: LensTrendingOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultLensTrendingCachedData(),
  });
  const lensTrendingData = cachedDataRefValue || defaultCachedDataRef.current;

  // TODO any
  const [lensTrending, setLensTrending] = useState<any[]>(
    lensTrendingData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(lensTrendingData.pageInfo);
  const lensAccessToken = useLensAccessToken();
  const loadLensTrending = useCallback(async () => {
    if (pageInfo.hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getLensTrending({
        endLensCursor: lensTrendingData.endLensCursor
          ? lensTrendingData.endLensCursor
          : undefined,
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
  }, [lensAccessToken, pageInfo]);

  return {
    loading,
    loadLensTrending,
    lensTrending,
    pageInfo,
  };
}
