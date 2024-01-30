import { useEffect, useMemo, useState } from 'react';
import { createPublicClient, http } from 'viem';
import { ZDK } from '@zoralabs/zdk';
import { Token } from '@zoralabs/zdk/dist/queries/queries-sdk';
import {
  casterZora1155ToMintAddress,
  casterZoraFixedPriceStrategyAddress,
  casterZoraNetwork,
  casterZoraNetworkInfo,
  ZORA_API_ENDPOINT,
  ZoraCreator1155ImplAbi,
  ZoraCreatorFixedPriceSaleStrategyAbi,
} from '../../constants/zora';
import { getSaleStatus } from '@/utils/shared/zora';

const args = {
  endPoint: ZORA_API_ENDPOINT,
  networks: [casterZoraNetworkInfo],
};
const zdk = new ZDK(args);

const publicClient = createPublicClient({
  chain: casterZoraNetwork,
  transport: http(),
});

export type Sale = {
  saleStart: bigint;
  saleEnd: bigint;
};

export type TokenInfo = Token &
  Sale & {
    uri: string;
    maxSupply: number;
    totalMinted: number;
  };

export enum SaleStatus {
  Unknown = -1,
  NotStarted = 0,
  InProgress = 1,
  Ended = 2,
}

export default function useCasterTokenInfoWithTokenId({
  tokenId,
}: {
  tokenId: number;
}) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    uri: '',
    maxSupply: 0,
    totalMinted: 0,
  } as TokenInfo);
  useEffect(() => {
    const readTokenInfo = async () => {
      const res = await publicClient.readContract({
        address: casterZora1155ToMintAddress,
        abi: ZoraCreator1155ImplAbi,
        functionName: 'getTokenInfo',
        args: [tokenId],
      });
      setTokenInfo(res as TokenInfo);
    };
    const readSale = async () => {
      const res = await publicClient.readContract({
        address: casterZoraFixedPriceStrategyAddress,
        abi: ZoraCreatorFixedPriceSaleStrategyAbi,
        functionName: 'sale',
        args: [casterZora1155ToMintAddress, tokenId],
      });
      setTokenInfo((pre) => ({ ...pre, ...(res as Sale) }));
    };
    const readFirstMint = async () => {
      const res = await zdk.token({
        token: {
          address: casterZora1155ToMintAddress,
          tokenId: String(tokenId),
        },
        includeFullDetails: true,
      });
      setTokenInfo((pre) => ({
        ...pre,
        ...((res.token?.token || {}) as Token),
      }));
    };
    if (tokenId) {
      readTokenInfo();
      readSale();
      readFirstMint();
    }
  }, [tokenId]);

  const { saleStart, saleEnd } = tokenInfo;

  const saleStatus = useMemo(
    () => getSaleStatus(Number(saleStart), Number(saleEnd)),
    [saleStart, saleEnd]
  );

  return {
    ...tokenInfo,
    saleStatus,
  };
}
