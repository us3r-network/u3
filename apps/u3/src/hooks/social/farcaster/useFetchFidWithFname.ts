import { useCallback, useState } from 'react';
import { getFarcasterUserInfoWithFname } from '../../../services/social/api/farcaster';

export default function useFetchFidWithFname() {
  const [fid, setFid] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFid = useCallback(async (fname: string) => {
    if (!fname) return;
    try {
      setLoading(true);
      const res = await getFarcasterUserInfoWithFname(fname);
      const { data } = res || {};
      setFid(String(data?.fid || ''));
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    fetchFid,
    loading,
    error,
    fid,
  };
}
