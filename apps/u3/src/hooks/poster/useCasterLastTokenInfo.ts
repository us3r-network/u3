import { useEffect, useState } from 'react';
import { createPublicClient, http } from 'viem';
import {
  casterZora1155ToMintAddress,
  casterZoraNetwork,
  ZoraCreator1155ImplAbi,
} from '../../constants/zora';
import useCasterTokenInfoWithTokenId from './useCasterTokenInfoWithTokenId';

const publicClient = createPublicClient({
  chain: casterZoraNetwork,
  transport: http(),
});

export default function useCasterLastTokenInfo() {
  const [lastTokenId, setLastTokenId] = useState(0);
  useEffect(() => {
    const readNextTokenId = async () => {
      const res = await publicClient.readContract({
        address: casterZora1155ToMintAddress,
        abi: ZoraCreator1155ImplAbi,
        functionName: 'nextTokenId',
      });
      setLastTokenId(res ? Number(res) - 1 : 0);
    };
    readNextTokenId();
  }, []);

  const lastTokenInfo = useCasterTokenInfoWithTokenId({
    tokenId: lastTokenId,
  });

  return {
    ...lastTokenInfo,
    lastTokenId,
  };
}
