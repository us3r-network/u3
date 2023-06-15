/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-26 13:14:23
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 13:25:37
 * @Description: file description
 */

import EvmSvg from '../components/chain/svgs/ethereum_eth_logo.svg';
import SolanaSvg from '../components/chain/svgs/solana_sol_logo.svg';
import PolygonSvg from '../components/chain/svgs/polygon-matic-logo.svg';
import BscLogo from '../components/chain/svgs/bsc-logo.svg';
import Aptos from '../components/chain/svgs/aptos-logo.svg';
import { ChainType } from '../services/types/common';

export type Chain = {
  name: string;
  type: ChainType;
  iconUrl: string;
};
export const chainMap: { [key in ChainType]: Chain } = {
  [ChainType.EVM]: {
    name: 'Ethereum',
    type: ChainType.EVM,
    iconUrl: EvmSvg,
  },
  [ChainType.SOLANA]: {
    name: 'Solana',
    type: ChainType.SOLANA,
    iconUrl: SolanaSvg,
  },
  [ChainType.BSC]: {
    name: 'Bsc',
    type: ChainType.BSC,
    iconUrl: BscLogo,
  },
  [ChainType.MATIC]: {
    name: 'Polygon',
    type: ChainType.MATIC,
    iconUrl: PolygonSvg,
  },
  [ChainType.APTOS]: {
    name: 'Aptos',
    type: ChainType.APTOS,
    iconUrl: Aptos,
  },
};

export const getChainInfo = (type: ChainType): Chain => {
  return chainMap[type];
};
