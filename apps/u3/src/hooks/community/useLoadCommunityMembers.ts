import { useCallback, useState } from 'react';
import {
  CommunityMembersPageInfo,
  fetchCommunityMembers,
} from '@/services/community/api/community';
import { MemberEntity } from '@/services/community/types/community';

const PAGE_SIZE = 16;
export default function useLoadCommunityMembers(communityId: string | number) {
  const [members, setMembers] = useState<MemberEntity[]>([]);
  const [pageInfo, setPageInfo] = useState<CommunityMembersPageInfo>({
    hasNextPage: true,
  });
  const [firstLoading, setFirstLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);

  const loadFirst = useCallback(async () => {
    setFirstLoading(true);
    setMembers([]);
    try {
      const res = await fetchCommunityMembers(communityId, {
        pageSize: PAGE_SIZE,
      });
      const data = res.data?.data;
      setPageInfo(data.pageInfo);
      setMembers(data.members);
    } catch (error) {
      console.error(error);
    } finally {
      setFirstLoading(false);
    }
  }, [communityId]);

  const loadMore = useCallback(async () => {
    if (firstLoading || moreLoading) return;
    setMoreLoading(true);
    try {
      const res = await fetchCommunityMembers(communityId, {
        pageSize: PAGE_SIZE,
        endCursor: pageInfo.endCursor,
      });
      const data = res.data?.data;
      setPageInfo(data.pageInfo);
      setMembers((prev) => [...prev, ...data.members]);
    } catch (error) {
      console.error(error);
    } finally {
      setMoreLoading(false);
    }
  }, [communityId, pageInfo, moreLoading, firstLoading]);

  return {
    members,
    pageInfo,
    firstLoading,
    moreLoading,
    loadFirst,
    loadMore,
  };
}
