/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-26 16:47:01
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-26 18:09:25
 * @FilePath: /u3/apps/u3/src/services/api/chainbase.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios, { AxiosPromise } from 'axios';
import { ApiResp } from '../types';

export type DappNFT = {
  contract_address: string;
  erc_type: string;
  floor_prices: string | null;
  image_uri: string;
  metadata: string | null;
  mint_time: string;
  mint_transaction_hash: string;
  name: string;
  owner: string;
  token_id: number;
  token_uri: string;
  total: number;
  total_string: string;
  traits: string | null;
};

const CHAINBASE_API_URL = 'https://api.chainbase.online/v1/';
const CHAINBASE_API_KEY = '2WTJxejPAqD7G4LnpVThGORkG1x';
export type DappNFTParams = {
  chain_id: number;
  address: string;
  contract_address: string;
};

export const getMyDappCollectionNFT = ({
  chain_id,
  address,
  contract_address,
}: DappNFTParams): AxiosPromise<ApiResp<Array<DappNFT>>> => {
  const CHAINBASE_NFT_BALANCES_API_URL = `${CHAINBASE_API_URL}account/nfts`;
  return axios.request({
    url: CHAINBASE_NFT_BALANCES_API_URL,
    method: 'GET',
    params: {
      chain_id,
      address,
      contract_address,
    },
    headers: {
      'x-api-key': CHAINBASE_API_KEY,
    },
  });
};
