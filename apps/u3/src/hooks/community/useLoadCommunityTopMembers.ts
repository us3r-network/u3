import { useCallback, useState } from 'react';
import { fetchCommunityTopMembers } from '@/services/community/api/community';
import { MemberEntity } from '@/services/community/types/community';

export default function useLoadCommunityTopMembers(
  communityId: string | number
) {
  const [members, setMembers] = useState<MemberEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setMembers([]);
    try {
      const res = await fetchCommunityTopMembers(communityId);
      const data = res.data?.data;
      setMembers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  return {
    members,
    loading,
    load,
  };
}
