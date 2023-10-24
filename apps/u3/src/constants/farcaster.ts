import { FarcasterNetwork, getHubRpcClient } from '@farcaster/hub-web';

export const FARCASTER_HUB_URL =
  process.env.REACT_APP_FARCASTER_HUB_URL || 'https://farcaster-dev.u3.xyz';
export const FARCASTER_NETWORK =
  process.env.REACT_APP_FARCASTER_NETWORK === 'testnet'
    ? FarcasterNetwork.TESTNET
    : FarcasterNetwork.MAINNET;

export const FARCASTER_WEB_CLIENT = getHubRpcClient(FARCASTER_HUB_URL, {});
export const FARCASTER_CLIENT_NAME = 'US3R';

export const WARPCAST_API = 'https://api.warpcast.com';

export const IdRegistryContract = '0x00000000FcAf86937e41bA038B4fA40BAA4B780A';
export const NameVerifyContract = '0xe3be01d99baa8db9905b33a3ca391238234b79d1';
export const SignerAddContract = '0x00000000fC9e66f1c6d86D750B4af47fF0Cc343d';
export const SignerVerifyContract =
  '0x00000000fc700472606ed4fa22623acf62c60553';
export const OP_CHAIN_ID = 10;
