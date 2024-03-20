import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchCommunityMembers } from '@/services/community/api/community';

export default function useLoadCommunityMembersTotalNum() {
  const [totalNum, setTotalNum] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCommunityMembersTotalNum = useCallback(
    async (params?: { id?: string | number }) => {
      const { id } = params || {};
      setLoading(true);
      try {
        const res = await fetchCommunityMembers(id, {
          pageSize: 0,
          pageNumber: 0,
        });
        const { code, msg, data } = res.data;
        if (code === 0) {
          const num = data?.totalNum || 0;
          setTotalNum(num);
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error(error);
        toast.error(
          `Load community members total num failed: ${error.message}`
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    totalNum,
    loadCommunityMembersTotalNum,
  };
}
