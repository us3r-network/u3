import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchCommunityMembers } from '@/services/community/api/community';
import { MemberEntity } from '@/services/community/types/community';

const PAGE_SIZE = 30;
export const getDefaultCommunityMembersCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    nextPageNumber: 1,
  };
};

type CommunityMembersCachedData = ReturnType<
  typeof getDefaultCommunityMembersCachedData
>;

type CommunityMembersOpts = {
  cachedDataRefValue?: CommunityMembersCachedData;
};

export default function useLoadCommunityMembers(opts?: CommunityMembersOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultCommunityMembersCachedData(),
  });
  const cachedData = cachedDataRefValue || defaultCachedDataRef.current;

  const [communityMembers, setCommunityMembers] = useState<Array<MemberEntity>>(
    cachedData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(cachedData.pageInfo);

  const loadCommunityMembers = useCallback(async (params?: { id?: string }) => {
    const { id } = params || {};

    if (cachedData.pageInfo.hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetchCommunityMembers(id, {
        pageSize: PAGE_SIZE,
        pageNumber: cachedData.nextPageNumber,
      });
      const { code, msg, data } = res.data;
      if (code === 0) {
        const newCommunityMembers = data?.members || [];
        const hasNextPage = newCommunityMembers.length >= PAGE_SIZE;
        setCommunityMembers((prev) => [...prev, ...newCommunityMembers]);
        setPageInfo({ hasNextPage });
        cachedData.data = cachedData.data.concat(newCommunityMembers);
        cachedData.nextPageNumber += 1;
        cachedData.pageInfo.hasNextPage = hasNextPage;
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Load community members failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    communityMembers,
    loadCommunityMembers,
    pageInfo,
  };
}
