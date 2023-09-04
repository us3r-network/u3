import { FarcasterNetwork, getHubRpcClient } from '@farcaster/hub-web'

export const FARCASTER_HUB_URL =
  process.env.REACT_APP_FARCASTER_HUB_URL || 'https://farcaster-dev.u3.xyz'
export const FARCASTER_NETWORK =
  process.env.REACT_APP_FARCASTER_NETWORK === 'testnet'
    ? FarcasterNetwork.TESTNET
    : FarcasterNetwork.MAINNET

console.log('FARCASTER_HUB_URL', FARCASTER_NETWORK, FARCASTER_HUB_URL)
export const FARCASTER_WEB_CLIENT = getHubRpcClient(FARCASTER_HUB_URL, {})
export const FARCASTER_CLIENT_NAME = 'US3R'

export const WARPCAST_API = 'https://api.warpcast.com'

export const FARCASTER_CHAIN_ID = 5
export const FARCASTER_ADDRESS = '0xDA107A1CAf36d198B12c16c7B6a1d1C795978C42'
export const FARCASTER_ABI = [
  {
    inputs: [{ internalType: 'address', name: '_forwarder', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'Escrow', type: 'error' },
  { inputs: [], name: 'HasId', type: 'error' },
  { inputs: [], name: 'HasNoId', type: 'error' },
  { inputs: [], name: 'Invitable', type: 'error' },
  { inputs: [], name: 'NoRecovery', type: 'error' },
  { inputs: [], name: 'Registrable', type: 'error' },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'by',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'CancelRecovery',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'url',
        type: 'string',
      },
    ],
    name: 'ChangeHome',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recovery',
        type: 'address',
      },
    ],
    name: 'ChangeRecoveryAddress',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'trustedCaller',
        type: 'address',
      },
    ],
    name: 'ChangeTrustedCaller',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'DisableTrustedOnly',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recovery',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'url',
        type: 'string',
      },
    ],
    name: 'Register',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'RequestRecovery',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: 'from', type: 'address' }],
    name: 'cancelRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'string', name: 'url', type: 'string' }],
    name: 'changeHome',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'recovery', type: 'address' }],
    name: 'changeRecoveryAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_trustedCaller',
        type: 'address',
      },
    ],
    name: 'changeTrustedCaller',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'from', type: 'address' }],
    name: 'completeRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'completeTransferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'disableTrustedOnly',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'idOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'forwarder', type: 'address' }],
    name: 'isTrustedForwarder',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'address', name: 'recovery', type: 'address' },
      { internalType: 'string', name: 'url', type: 'string' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'requestRecovery',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'requestTransferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'transfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'address', name: 'recovery', type: 'address' },
      { internalType: 'string', name: 'url', type: 'string' },
    ],
    name: 'trustedRegister',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
