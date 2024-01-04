import { useMemo } from 'react';
import { useContractRead } from 'wagmi';
import {
  casterZora1155ToMintAddress,
  casterZoraFixedPriceStrategyAddress,
  ZoraCreator1155ImplAbi,
  ZoraCreatorFixedPriceSaleStrategyAbi,
} from '../../constants/zora';

export type TokenInfo = {
  uri: string;
  maxSupply: number;
  totalMinted: number;
};

export default function useCasterCollection({
  owner,
}: {
  owner: string | null;
}) {
  const { data: nextTokenId } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'nextTokenId',
  });

  const lastTokenId = nextTokenId ? Number(nextTokenId) - 1 : 0;

  const { data: lastTokenInfo } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'getTokenInfo',
    args: [lastTokenId],
  });

  const { data: sale } = useContractRead({
    address: casterZoraFixedPriceStrategyAddress,
    abi: ZoraCreatorFixedPriceSaleStrategyAbi,
    functionName: 'sale',
    args: [casterZora1155ToMintAddress, lastTokenId],
  });
  const { saleEnd } = (sale || {}) as { saleEnd: bigint };
  const lastTokenFromToday = useMemo(
    () => lastTokenId > 0 && saleEnd && Number(saleEnd) > Date.now() / 1000,
    [lastTokenId, saleEnd]
  );

  const { data: balanceOf } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'balanceOf',
    args: [owner, lastTokenId],
  });
  const ownerMinted = useMemo(
    () => balanceOf && Number(balanceOf) === 1,
    [balanceOf]
  );

  return {
    lastTokenId,
    lastTokenInfo: lastTokenInfo as TokenInfo,
    lastTokenFromToday,
    ownerMinted,
  };
}
