import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  NewestCommunitiesData,
  fetchNewestCommunities,
} from '@/services/community/api/community';

const PAGE_SIZE = 30;
export const getDefaultNewestCommunitiesCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    nextPageNumber: 1,
    type: '',
  };
};

type NewestCommunitiesCachedData = ReturnType<
  typeof getDefaultNewestCommunitiesCachedData
>;

type NewestCommunitiesOpts = {
  cachedDataRefValue?: NewestCommunitiesCachedData;
};

export default function useLoadNewestCommunities(opts?: NewestCommunitiesOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultNewestCommunitiesCachedData(),
  });
  const cachedData = cachedDataRefValue || defaultCachedDataRef.current;

  const [newestCommunities, setNewestCommunities] =
    useState<NewestCommunitiesData>(cachedData.data);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(cachedData.pageInfo);

  const loadNewestCommunities = useCallback(
    async ({ type }: { type?: string }) => {
      if (type !== cachedData?.type) {
        setNewestCommunities([]);
        setPageInfo({ hasNextPage: true });
        Object.assign(cachedData, {
          ...getDefaultNewestCommunitiesCachedData(),
          type,
        });
      }
      if (cachedData.pageInfo.hasNextPage === false) {
        return;
      }
      setLoading(true);
      try {
        const res = await fetchNewestCommunities({
          pageSize: PAGE_SIZE,
          pageNumber: cachedData.nextPageNumber,
          type: cachedData?.type || undefined,
        });
        const { code, msg, data } = res.data;
        if (code === 0) {
          const newCommunities = data || [];
          const hasNextPage = newCommunities.length >= PAGE_SIZE;
          setNewestCommunities((prev) => [...prev, ...newCommunities]);
          setPageInfo({ hasNextPage });
          cachedData.data = cachedData.data.concat(newCommunities);
          cachedData.nextPageNumber += 1;
          cachedData.pageInfo.hasNextPage = hasNextPage;
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error(error);
        toast.error(`Load newest communities failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    newestCommunities,
    loadNewestCommunities,
    pageInfo,
  };
}
