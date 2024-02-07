import { toast } from 'react-toastify';
import { useCallback, useEffect, useState } from 'react';
import { getClaimStatusApi } from '@/services/social/api/farcaster';
import useLogin from '@/hooks/shared/useLogin';

export default function useFarcasterClaim({ currFid }: { currFid: number }) {
  const [mounted, setMounted] = useState(false);
  const { isLogin } = useLogin();
  const [claimStatus, setClaimStatus] = useState({
    statusCode: 100,
    amount: 100,
    msg: '',
  });

  const getClaimStatus = useCallback(async () => {
    if (!isLogin) {
      return;
    }
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
  }, [isLogin]);

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
