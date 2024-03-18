import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  JoinedCommunitiesData,
  fetchJoinedCommunities,
} from '@/services/community/api/community';

const PAGE_SIZE = 30;
export const getDefaultJoinedCommunitiesCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    nextPageNumber: 1,
    type: '',
  };
};

type JoinedCommunitiesCachedData = ReturnType<
  typeof getDefaultJoinedCommunitiesCachedData
>;

type JoinedCommunitiesOpts = {
  cachedDataRefValue?: JoinedCommunitiesCachedData;
};

export default function useLoadJoinedCommunities(opts?: JoinedCommunitiesOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultJoinedCommunitiesCachedData(),
  });
  const cachedData = cachedDataRefValue || defaultCachedDataRef.current;

  const [joinedCommunities, setJoinedCommunities] =
    useState<JoinedCommunitiesData>(cachedData.data);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(cachedData.pageInfo);

  const loadJoinedCommunities = useCallback(
    async (params?: { type?: string }) => {
      const { type } = params || {};
      if (type !== cachedData?.type) {
        setJoinedCommunities([]);
        setPageInfo({ hasNextPage: true });
        Object.assign(cachedData, {
          ...getDefaultJoinedCommunitiesCachedData(),
          type,
        });
      }
      if (cachedData.pageInfo.hasNextPage === false) {
        return;
      }
      setLoading(true);
      try {
        const res = await fetchJoinedCommunities({
          pageSize: PAGE_SIZE,
          pageNumber: cachedData.nextPageNumber,
          type: cachedData?.type || undefined,
        });
        const { code, msg, data } = res.data;
        if (code === 0) {
          const newCommunities = data || [];
          const hasNextPage = newCommunities.length >= PAGE_SIZE;
          setJoinedCommunities((prev) => [...prev, ...newCommunities]);
          setPageInfo({ hasNextPage });
          cachedData.data = cachedData.data.concat(newCommunities);
          cachedData.nextPageNumber += 1;
          cachedData.pageInfo.hasNextPage = hasNextPage;
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error(error);
        toast.error(`Load joined communities failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    joinedCommunities,
    loadJoinedCommunities,
    pageInfo,
  };
}
