import { mainnet, goerli, optimism, optimismGoerli } from 'viem/chains';
import { ZDKNetwork, ZDKChain } from '@zoralabs/zdk';

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
  const zoraMainnetMintHost = 'https://zora.co';
  const zoraTestnetMintHost = 'https://testnet.zora.co';
  const zoraMintHost =
    Number(chainId) === mainnet.id ? zoraMainnetMintHost : zoraTestnetMintHost;
  return `${zoraMintHost}/collect/zora:${mintAddress}/${tokenId}?referrer=${referrerAddress}`;
};
