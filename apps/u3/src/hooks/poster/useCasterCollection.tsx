import { useMemo } from 'react';
import { useContractRead } from 'wagmi';
import dayjs from 'dayjs';
import {
  casterZora1155ToMintAddress,
  casterZoraFixedPriceStrategyAddress,
  ZoraCreator1155ImplAbi,
  ZoraCreatorFixedPriceSaleStrategyAbi,
} from '../../constants/zora';

function isToday(timestamp) {
  const now = dayjs();
  const today = now.startOf('day');
  const tomorrow = now.add(1, 'day').startOf('day');

  return timestamp >= today && timestamp < tomorrow;
}

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
  const { data: collectionName } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'name',
  });

  const { data: nextTokenId } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'nextTokenId',
  });

  const lastTokenId = nextTokenId ? Number(nextTokenId) - 1 : 0;

  const { data: isAdminOrRole } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'isAdminOrRole',
    args: [owner, lastTokenId, 2],
  });

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
  const { saleStart } = (sale || {}) as { saleStart: bigint };

  const lastTokenFromToday = useMemo(
    () => lastTokenId > 0 && saleStart && isToday(Number(saleStart) * 1000),
    [lastTokenId, saleStart]
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
    collectionName,
    isAdminOrRole,
    lastTokenId,
    lastTokenInfo: lastTokenInfo as TokenInfo,
    lastTokenFromToday,
    ownerMinted,
  };
}
