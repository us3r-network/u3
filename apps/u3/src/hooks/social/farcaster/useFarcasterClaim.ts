import { useCallback, useEffect, useState } from 'react';
import { getClaimStatusApi } from '@/services/social/api/farcaster';

export default function useFarcasterClaim({ currFid }: { currFid: number }) {
  const [mounted, setMounted] = useState(false);
  const [claimStatus, setClaimStatus] = useState({
    claimed: false,
    amount: 100,
    msg: '',
  });

  const getClaimStatus = useCallback(async (fid: number) => {
    try {
      const data = await getClaimStatusApi({ fid });
    } catch (e) {
      console.error('Error getting claim status', e);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currFid) return;
    getClaimStatus(currFid);
  }, [getClaimStatus, mounted, currFid]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    claimStatus,
    setClaimStatus,
  };
}
