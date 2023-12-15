import { useEffect, useState, useCallback } from 'react';

import { getPinupHashes } from '@/services/social/api/farcaster';

export default function usePinupHashes() {
  const [pinupHashes, setPinupHashes] = useState(new Set<string>());
  const updatePinupHashes = useCallback(async () => {
    try {
      const resp = await getPinupHashes();
      const { data } = resp.data;
      setPinupHashes(new Set(data.data));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    updatePinupHashes();
  }, []);

  return {
    pinupHashes,
    updatePinupHashes,
  };
}
