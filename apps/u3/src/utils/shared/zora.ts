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
export const getZoraHost = (chainId) => {
  const zoraMainnetMintHost = 'https://zora.co';
  const zoraTestnetMintHost = 'https://testnet.zora.co';
  return Number(chainId) === mainnet.id
    ? zoraMainnetMintHost
    : Number(chainId) === goerli.id
    ? zoraTestnetMintHost
    : Number(chainId) === optimism.id
    ? zoraMainnetMintHost
    : Number(chainId) === optimismGoerli.id
    ? zoraTestnetMintHost
    : zoraTestnetMintHost;
};
export const getZoraCollectChainPrefix = (chainId) => {
  return Number(chainId) === mainnet.id
    ? 'zora'
    : Number(chainId) === goerli.id
    ? 'gor'
    : Number(chainId) === optimism.id
    ? 'zora'
    : Number(chainId) === optimismGoerli.id
    ? 'gor'
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
