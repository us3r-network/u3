/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:08:17
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-25 09:21:48
 * @FilePath: /u3/apps/u3/src/constants/zora.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  mainnet,
  goerli,
  optimism,
  optimismGoerli,
  // base,
  // baseGoerli,
  // zora,
  // zoraTestnet,
} from 'viem/chains';
import { ZDKNetwork, ZDKChain } from '@zoralabs/zdk';
import { ZoraCreator1155ImplAbi } from '../services/dapp/abi/zora/ZoraCreator1155ImplABI';
import { ZoraCreatorFixedPriceSaleStrategyAbi } from '../services/dapp/abi/zora/ZoraCreatorFixedPriceSaleStrategyABI';

export { ZoraCreator1155ImplAbi, ZoraCreatorFixedPriceSaleStrategyAbi };

export const zora1155ToMintAddress: `0x${string}` = process.env
  .REACT_APP_DAPP_NFT_TO_MINT as `0x${string}`;
export const zoraFixedPriceStrategyAddress: `0x${string}` = process.env
  .REACT_APP_DAPP_NFT_FIXED_PRICE_STRATEGY as `0x${string}`;
export const ziraChainId: number = process.env
  .REACT_APP_DAPP_NFT_CHAIN_ID as unknown as number;
export const zoraDappsNetworkInfo =
  Number(ziraChainId) === mainnet.id
    ? {
        network: ZDKNetwork.Ethereum,
        chain: ZDKChain.Mainnet,
        // explorer: mainnet.blockExplorers.default.url,
      }
    : Number(ziraChainId) === goerli.id
    ? {
        network: ZDKNetwork.Ethereum,
        chain: ZDKChain.Goerli,
        // explorer: goerli.blockExplorers.default.url,
      }
    : Number(ziraChainId) === optimism.id
    ? {
        network: ZDKNetwork.Optimism,
        chain: ZDKChain.OptimismMainnet,
        // explorer: optimism.blockExplorers.default.url,
      }
    : Number(ziraChainId) === optimismGoerli.id
    ? {
        network: ZDKNetwork.Optimism,
        chain: ZDKChain.OptimismGoerli,
        // explorer: optimismGoerli.blockExplorers.default.url,
      }
    : null;
export const zoraDappsNetworkExplorer =
  Number(ziraChainId) === mainnet.id
    ? mainnet.blockExplorers.default.url
    : Number(ziraChainId) === goerli.id
    ? goerli.blockExplorers.default.url
    : Number(ziraChainId) === optimism.id
    ? optimism.blockExplorers.default.url
    : Number(ziraChainId) === optimismGoerli.id
    ? optimismGoerli.blockExplorers.default.url
    : null;
export const recipientAddress: `0x${string}` = process.env
  .REACT_APP_DAPP_NFT_RECIPIENT_ADDRESS as `0x${string}`;

export const ZORA_API_ENDPOINT = 'https://api.zora.co/graphql';
export const ZORA_API_KEY = '';
