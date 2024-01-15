import { useEffect, useMemo, useState } from 'react';
import { createPublicClient, http } from 'viem';
import dayjs from 'dayjs';
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
  NotStarted = 0,
  InProgress = 1,
  Ended = 2,
}

const args = {
  endPoint: ZORA_API_ENDPOINT,
  networks: [casterZoraNetworkInfo],
};
const zdk = new ZDK(args);

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
      const publicClient = createPublicClient({
        chain: casterZoraNetwork,
        transport: http(),
      });
      const res = await publicClient.readContract({
        address: casterZora1155ToMintAddress,
        abi: ZoraCreator1155ImplAbi,
        functionName: 'getTokenInfo',
        args: [tokenId],
      });
      setTokenInfo(res as TokenInfo);
    };
    const readSale = async () => {
      const publicClient = createPublicClient({
        chain: casterZoraNetwork,
        transport: http(),
      });
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

  const saleStatus = useMemo(() => {
    const now = dayjs().toDate().getTime();
    if (now < Number(saleStart)) return SaleStatus.NotStarted;
    if (now > Number(saleEnd)) return SaleStatus.Ended;
    return SaleStatus.InProgress;
  }, [saleStart, saleEnd]);

  return {
    ...tokenInfo,
    saleStatus,
  };
}
