import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  TrendingCommunitiesData,
  fetchTrendingCommunities,
} from '@/services/community/api/community';

const PAGE_SIZE = 30;
export const getDefaultTrendingCommunitiesCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    nextPageNumber: 1,
    type: '',
  };
};

type TrendingCommunitiesCachedData = ReturnType<
  typeof getDefaultTrendingCommunitiesCachedData
>;

type TrendingCommunitiesOpts = {
  cachedDataRefValue?: TrendingCommunitiesCachedData;
};

export default function useLoadTrendingCommunities(
  opts?: TrendingCommunitiesOpts
) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultTrendingCommunitiesCachedData(),
  });
  const cachedData = cachedDataRefValue || defaultCachedDataRef.current;

  const [trendingCommunities, setTrendingCommunities] =
    useState<TrendingCommunitiesData>(cachedData.data);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(cachedData.pageInfo);

  const loadTrendingCommunities = useCallback(
    async ({ type }: { type?: string }) => {
      if (type !== cachedData?.type) {
        setTrendingCommunities([]);
        setPageInfo({ hasNextPage: true });
        Object.assign(cachedData, {
          ...getDefaultTrendingCommunitiesCachedData(),
          type,
        });
      }
      if (cachedData.pageInfo.hasNextPage === false) {
        return;
      }
      setLoading(true);
      try {
        const res = await fetchTrendingCommunities({
          pageSize: PAGE_SIZE,
          pageNumber: cachedData.nextPageNumber,
          type: cachedData?.type || undefined,
        });
        const { code, msg, data } = res.data;
        if (code === 0) {
          const newCommunities = data || [];
          const hasNextPage = newCommunities.length >= PAGE_SIZE;
          setTrendingCommunities((prev) => [...prev, ...newCommunities]);
          setPageInfo({ hasNextPage });
          cachedData.data = cachedData.data.concat(newCommunities);
          cachedData.nextPageNumber += 1;
          cachedData.pageInfo.hasNextPage = hasNextPage;
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error(error);
        toast.error(`Load trending communities failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    trendingCommunities,
    loadTrendingCommunities,
    pageInfo,
  };
}
