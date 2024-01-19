import {
  ID_GATEWAY_ADDRESS,
  idGatewayABI,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  ID_REGISTRY_ADDRESS,
  idRegistryABI,
  STORAGE_REGISTRY_ADDRESS,
  storageRegistryABI,
} from '@farcaster/hub-web';

import { optimism } from 'viem/chains';
import { zeroAddress } from 'viem';

export const CHAIN = optimism;

export const IdGateway = {
  abi: idGatewayABI,
  address: ID_GATEWAY_ADDRESS,
  chain: CHAIN,
};
export const IdContract = {
  abi: idRegistryABI,
  address: ID_REGISTRY_ADDRESS,
  chain: CHAIN,
};
// export const KeyContract = {
//   abi: keyRegistryABI,
//   address: KEY_REGISTRY_ADDRESS,
//   chain: CHAIN,
// };
export const KeyContract = {
  abi: keyGatewayABI,
  address: KEY_GATEWAY_ADDRESS,
  chain: CHAIN,
};

export const RentContract = {
  abi: storageRegistryABI,
  address: STORAGE_REGISTRY_ADDRESS,
  chain: CHAIN,
};

export const RECOVERY_ADDRESS = zeroAddress; // Optional, using the default value means the account will not be recoverable later if the mnemonic is lost
