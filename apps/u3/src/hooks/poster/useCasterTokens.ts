import { ZDK } from '@zoralabs/zdk';
import { useState } from 'react';
import {
  ZORA_API_ENDPOINT,
  casterZora1155ToMintAddress,
  casterZoraNetworkInfo,
} from '@/constants/zora';

const args = {
  endPoint: ZORA_API_ENDPOINT,
  networks: [casterZoraNetworkInfo],
};

const zdk = new ZDK(args);
export default function useCasterTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const nfts = await zdk.tokens({
        where: {
          collectionAddresses: [casterZora1155ToMintAddress],
        },
      });
      console.log('nfts: ', nfts);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    tokens,
    loading,
    load,
  };
}
