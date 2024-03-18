import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  CommunityTypesData,
  fetchCommunityTypes,
} from '@/services/community/api/community';

export default function useLoadCommunityTypes() {
  const [communityTypes, setCommunityTypes] = useState<CommunityTypesData>([]);
  const [communityTypesPending, setCommunityTypesPending] = useState(false);
  const loadCommunityTypes = useCallback(async () => {
    try {
      setCommunityTypesPending(true);
      const res = await fetchCommunityTypes();
      const { code, msg, data } = res.data;
      if (code === 0) {
        setCommunityTypes(data);
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Load community types failed: ${error.message}`);
    } finally {
      setCommunityTypesPending(false);
    }
  }, []);

  return {
    communityTypes,
    communityTypesPending,
    loadCommunityTypes,
  };
}
