import {
  mainnet,
  goerli,
  optimism,
  optimismGoerli,
  sepolia,
  zoraTestnet,
  zora,
  base,
  pgn,
} from 'viem/chains';
import { ZDKNetwork, ZDKChain } from '@zoralabs/zdk';
import { isMillisecondTimestamp, isSecondTimestamp } from './time';

export const zoraMainnetChainIds: number[] = [
  mainnet.id,
  zora.id,
  optimism.id,
  base.id,
  pgn.id,
];
export const zoraMainnetMintHost = 'https://zora.co';
export const zoraTestnetMintHost = 'https://testnet.zora.co';

export const getZoraNetworkInfo = (chainId) => {
  return Number(chainId) === mainnet.id
    ? {
        network: ZDKNetwork.Ethereum,
        chain: ZDKChain.Mainnet,
      }
    : Number(chainId) === goerli.id
    ? {
        network: ZDKNetwork.Ethereum,
        chain: ZDKChain.Goerli,
      }
    : Number(chainId) === optimism.id
    ? {
        network: ZDKNetwork.Optimism,
        chain: ZDKChain.OptimismMainnet,
      }
    : Number(chainId) === optimismGoerli.id
    ? {
        network: ZDKNetwork.Optimism,
        chain: ZDKChain.OptimismGoerli,
      }
    : Number(chainId) === sepolia.id
    ? {
        network: ZDKNetwork.Ethereum,
        chain: ZDKChain.Sepolia,
      }
    : Number(chainId) === zoraTestnet.id
    ? {
        network: ZDKNetwork.Zora,
        chain: ZDKChain.ZoraGoerli,
      }
    : Number(chainId) === zora.id
    ? {
        network: ZDKNetwork.Zora,
        chain: ZDKChain.ZoraMainnet,
      }
    : Number(chainId) === base.id
    ? {
        network: ZDKNetwork.Base,
        chain: ZDKChain.BaseMainnet,
      }
    : null;
};

export const getZoraNetwork = (chainId) => {
  return Number(chainId) === mainnet.id
    ? mainnet
    : Number(chainId) === goerli.id
    ? goerli
    : Number(chainId) === optimism.id
    ? optimism
    : Number(chainId) === optimismGoerli.id
    ? optimismGoerli
    : Number(chainId) === sepolia.id
    ? sepolia
    : Number(chainId) === zoraTestnet.id
    ? zoraTestnet
    : Number(chainId) === zora.id
    ? zora
    : Number(chainId) === base.id
    ? base
    : null;
};

export const getZoraNetworkExplorer = (chainId) => {
  return Number(chainId) === mainnet.id
    ? mainnet.blockExplorers.default.url
    : Number(chainId) === goerli.id
    ? goerli.blockExplorers.default.url
    : Number(chainId) === optimism.id
    ? optimism.blockExplorers.default.url
    : Number(chainId) === optimismGoerli.id
    ? optimismGoerli.blockExplorers.default.url
    : Number(chainId) === sepolia.id
    ? sepolia.blockExplorers.default.url
    : Number(chainId) === zoraTestnet.id
    ? zoraTestnet.blockExplorers.default.url
    : Number(chainId) === zora.id
    ? zora.blockExplorers.default.url
    : Number(chainId) === base.id
    ? base.blockExplorers.default.url
    : null;
};
export const getZoraHost = (chainId) => {
  return zoraMainnetChainIds.includes(Number(chainId))
    ? zoraMainnetMintHost
    : zoraTestnetMintHost;
};
export const getZoraCollectChainPrefix = (chainId) => {
  return Number(chainId) === mainnet.id
    ? 'eth'
    : Number(chainId) === zora.id
    ? 'zora'
    : Number(chainId) === optimism.id
    ? 'oeth'
    : Number(chainId) === base.id
    ? 'base'
    : Number(chainId) === pgn.id
    ? 'pgn'
    : Number(chainId) === goerli.id
    ? 'gor'
    : Number(chainId) === optimismGoerli.id
    ? 'ogor'
    : Number(chainId) === sepolia.id
    ? 'sep'
    : Number(chainId) === zoraTestnet.id
    ? 'zgor'
    : null;
};

export const getZoraMintLink = ({
  chainId,
  mintAddress,
  tokenId,
  referrerAddress,
}: {
  chainId;
  mintAddress: string;
  tokenId: number;
  referrerAddress?: string;
}) => {
  const zoraMintHost = getZoraHost(chainId);
  const chainPrefix = getZoraCollectChainPrefix(chainId);
  return `${zoraMintHost}/collect/${chainPrefix}:${mintAddress}/${tokenId}?referrer=${referrerAddress}`;
};

export const getZoraMintFeeWithChain = (chainId, contractMintFee: any) => {
  const fixedMintFeeBigInt = BigInt(0.000777 * 10 ** 18);
  if (Number(chainId) === goerli.id) {
    return fixedMintFeeBigInt;
  }
  return contractMintFee;
};

export enum SaleStatus {
  Unknown = -1,
  NotStarted = 0,
  InProgress = 1,
  Ended = 2,
}
export const getSaleStatus = (saleStart: string, saleEnd: string) => {
  const nowMillisecondTimestamp = Date.now();
  const nowSecondTimestamp = Math.floor(nowMillisecondTimestamp / 1000);

  const compareFn = (
    now: string | number,
    start: string | number,
    end: string | number
  ) => {
    if (Number(now) < Number(start)) {
      return SaleStatus.NotStarted;
    }
    if (Number(now) > Number(end)) {
      return SaleStatus.Ended;
    }
    return SaleStatus.InProgress;
  };
  if (isSecondTimestamp(saleStart) && isSecondTimestamp(saleEnd)) {
    return compareFn(nowSecondTimestamp, saleStart, saleEnd);
  }

  if (isMillisecondTimestamp(saleStart) && isMillisecondTimestamp(saleEnd)) {
    return compareFn(nowMillisecondTimestamp, saleStart, saleEnd);
  }

  if (isMillisecondTimestamp(saleStart) && isSecondTimestamp(saleEnd)) {
    return compareFn(nowSecondTimestamp, saleStart, Number(saleEnd) * 100);
  }

  if (isSecondTimestamp(saleStart) && isMillisecondTimestamp(saleEnd)) {
    return compareFn(nowMillisecondTimestamp, Number(saleStart) * 100, saleEnd);
  }

  if (saleStart.length > 13) {
    return SaleStatus.NotStarted;
  }

  if (saleEnd.length > 13) {
    return SaleStatus.InProgress;
  }

  return SaleStatus.Unknown;
};
