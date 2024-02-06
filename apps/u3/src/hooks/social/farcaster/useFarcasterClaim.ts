import { useCallback, useEffect, useState } from 'react';
import { getClaimStatusApi } from '@/services/social/api/farcaster';

export default function useFarcasterClaim({ currFid }: { currFid: number }) {
  const [mounted, setMounted] = useState(false);
  const [claimStatus, setClaimStatus] = useState({
    statusCode: 100,
    amount: 100,
    msg: '',
  });

  const getClaimStatus = useCallback(async () => {
    try {
      const resp = await getClaimStatusApi();
      const { data } = resp;
      setClaimStatus({
        statusCode: data.data.statusCode,
        amount: data.data.amount || 100,
        msg: data.msg,
      });
      console.log('getClaimStatus', data);
    } catch (e) {
      console.error('Error getting claim status', e);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!currFid) {
      console.log('No FID', { currFid });
      return;
    }
    getClaimStatus();
  }, [getClaimStatus, mounted, currFid]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    claimStatus,
    setClaimStatus,
  };
}
