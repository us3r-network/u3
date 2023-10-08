import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';

const isWalletAddress = (str: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(str);
};
const isEnsAddress = (str: string) => {
  return /^[a-zA-Z0-9-]+\.eth$/.test(str);
};
export default function useProfileWalletAddress(user: string) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient({
    chainId: 1,
  });

  useEffect(() => {
    if (isWalletAddress(user)) {
      setAddress(user);
      setLoading(false);
      return;
    }
    if (isEnsAddress(user)) {
      setLoading(true);
      publicClient
        .getEnsAddress({
          name: user,
        })
        .then((res) => {
          setAddress(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [user, publicClient]);

  return {
    address,
    loading,
  };
}
