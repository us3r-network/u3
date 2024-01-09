/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:08:17
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-21 16:05:23
 * @FilePath: /u3/apps/u3/src/constants/zora.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ZoraCreator1155ImplAbi } from '../services/dapp/abi/zora/ZoraCreator1155ImplABI';
import { ZoraCreatorFixedPriceSaleStrategyAbi } from '../services/dapp/abi/zora/ZoraCreatorFixedPriceSaleStrategyABI';
import {
  getZoraNetwork,
  getZoraNetworkExplorer,
  getZoraNetworkInfo,
} from '@/utils/shared/zora';

export const ZORA_API_ENDPOINT = 'https://api.zora.co/graphql';
export const ZORA_API_KEY = '';

export { ZoraCreator1155ImplAbi, ZoraCreatorFixedPriceSaleStrategyAbi };

// u3 dapp
export const zora1155ToMintAddress: `0x${string}` = process.env
  .REACT_APP_DAPP_NFT_TO_MINT as `0x${string}`;
export const zoraFixedPriceStrategyAddress: `0x${string}` = process.env
  .REACT_APP_DAPP_NFT_FIXED_PRICE_STRATEGY as `0x${string}`;
export const ziraChainId: number = process.env
  .REACT_APP_DAPP_NFT_CHAIN_ID as unknown as number;
export const zoraDappsNetworkInfo = getZoraNetworkInfo(ziraChainId);
export const zoraDappsNetwork = getZoraNetwork(ziraChainId);
export const zoraDappsNetworkExplorer = getZoraNetworkExplorer(ziraChainId);

export const recipientAddress: `0x${string}` = process.env
  .REACT_APP_DAPP_NFT_RECIPIENT_ADDRESS as `0x${string}`;

// U3 Caster
export const casterZora1155ToMintAddress: `0x${string}` = process.env
  .REACT_APP_CASTER_NFT_TO_MINT as `0x${string}`;
export const casterZoraFixedPriceStrategyAddress: `0x${string}` = process.env
  .REACT_APP_CASTER_NFT_FIXED_PRICE_STRATEGY as `0x${string}`;
export const casterZoraChainId: number = process.env
  .REACT_APP_CASTER_NFT_CHAIN_ID as unknown as number;
export const casterZoraNetworkInfo = getZoraNetworkInfo(casterZoraChainId);
export const casterZoraNetwork = getZoraNetwork(casterZoraChainId);
export const casterZoraNetworkExplorer =
  getZoraNetworkExplorer(casterZoraChainId);
export const casterRecipientAddress: `0x${string}` = process.env
  .REACT_APP_CASTER_NFT_RECIPIENT_ADDRESS as `0x${string}`;
