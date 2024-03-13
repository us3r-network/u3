import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  GrowingCommunitiesData,
  fetchGrowingCommunities,
} from '@/services/community/api/community';

const PAGE_SIZE = 30;
export const getDefaultGrowingCommunitiesCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    nextPageNumber: 1,
    type: '',
  };
};

type GrowingCommunitiesCachedData = ReturnType<
  typeof getDefaultGrowingCommunitiesCachedData
>;

type GrowingCommunitiesOpts = {
  cachedDataRefValue?: GrowingCommunitiesCachedData;
};

export default function useLoadGrowingCommunities(
  opts?: GrowingCommunitiesOpts
) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultGrowingCommunitiesCachedData(),
  });
  const cachedData = cachedDataRefValue || defaultCachedDataRef.current;

  const [growingCommunities, setGrowingCommunities] =
    useState<GrowingCommunitiesData>(cachedData.data);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(cachedData.pageInfo);

  const loadGrowingCommunities = useCallback(
    async (params?: { type?: string }) => {
      const { type } = params || {};
      if (type !== cachedData?.type) {
        setGrowingCommunities([]);
        setPageInfo({ hasNextPage: true });
        Object.assign(cachedData, {
          ...getDefaultGrowingCommunitiesCachedData(),
          type,
        });
      }
      if (cachedData.pageInfo.hasNextPage === false) {
        return;
      }
      setLoading(true);
      try {
        const res = await fetchGrowingCommunities({
          pageSize: PAGE_SIZE,
          pageNumber: cachedData.nextPageNumber,
          type: cachedData?.type || undefined,
        });
        const { code, msg, data } = res.data;
        if (code === 0) {
          const newCommunities = data || [];
          const hasNextPage = newCommunities.length >= PAGE_SIZE;
          setGrowingCommunities((prev) => [...prev, ...newCommunities]);
          setPageInfo({ hasNextPage });
          cachedData.data = cachedData.data.concat(newCommunities);
          cachedData.nextPageNumber += 1;
          cachedData.pageInfo.hasNextPage = hasNextPage;
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error(error);
        toast.error(`Load growing communities failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    growingCommunities,
    loadGrowingCommunities,
    pageInfo,
  };
}
