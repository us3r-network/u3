export const ZoraCreatorFixedPriceSaleStrategyAbi = [
  { inputs: [], name: 'SaleEnded', type: 'error' },
  { inputs: [], name: 'SaleHasNotStarted', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'limit', type: 'uint256' },
      { internalType: 'uint256', name: 'requestedAmount', type: 'uint256' },
    ],
    name: 'UserExceedsMintLimit',
    type: 'error',
  },
  { inputs: [], name: 'WrongValueSent', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'tokenContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'quantity',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'comment',
        type: 'string',
      },
    ],
    name: 'MintComment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'mediaContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        components: [
          { internalType: 'uint64', name: 'saleStart', type: 'uint64' },
          { internalType: 'uint64', name: 'saleEnd', type: 'uint64' },
          {
            internalType: 'uint64',
            name: 'maxTokensPerAddress',
            type: 'uint64',
          },
          { internalType: 'uint96', name: 'pricePerToken', type: 'uint96' },
          { internalType: 'address', name: 'fundsRecipient', type: 'address' },
        ],
        indexed: false,
        internalType: 'struct ZoraCreatorFixedPriceSaleStrategy.SalesConfig',
        name: 'salesConfig',
        type: 'tuple',
      },
    ],
    name: 'SaleSet',
    type: 'event',
  },
  {
    inputs: [],
    name: 'contractName',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractVersion',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenContract', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'address', name: 'wallet', type: 'address' },
    ],
    name: 'getMintedPerWallet',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'quantity', type: 'uint256' },
      { internalType: 'uint256', name: 'ethValueSent', type: 'uint256' },
      { internalType: 'bytes', name: 'minterArguments', type: 'bytes' },
    ],
    name: 'requestMint',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'enum ICreatorCommands.CreatorActions',
                name: 'method',
                type: 'uint8',
              },
              { internalType: 'bytes', name: 'args', type: 'bytes' },
            ],
            internalType: 'struct ICreatorCommands.Command[]',
            name: 'commands',
            type: 'tuple[]',
          },
          { internalType: 'uint256', name: 'at', type: 'uint256' },
        ],
        internalType: 'struct ICreatorCommands.CommandSet',
        name: 'commands',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'resetSale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'tokenContract', type: 'address' },
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'sale',
    outputs: [
      {
        components: [
          { internalType: 'uint64', name: 'saleStart', type: 'uint64' },
          { internalType: 'uint64', name: 'saleEnd', type: 'uint64' },
          {
            internalType: 'uint64',
            name: 'maxTokensPerAddress',
            type: 'uint64',
          },
          { internalType: 'uint96', name: 'pricePerToken', type: 'uint96' },
          { internalType: 'address', name: 'fundsRecipient', type: 'address' },
        ],
        internalType: 'struct ZoraCreatorFixedPriceSaleStrategy.SalesConfig',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      {
        components: [
          { internalType: 'uint64', name: 'saleStart', type: 'uint64' },
          { internalType: 'uint64', name: 'saleEnd', type: 'uint64' },
          {
            internalType: 'uint64',
            name: 'maxTokensPerAddress',
            type: 'uint64',
          },
          { internalType: 'uint96', name: 'pricePerToken', type: 'uint96' },
          { internalType: 'address', name: 'fundsRecipient', type: 'address' },
        ],
        internalType: 'struct ZoraCreatorFixedPriceSaleStrategy.SalesConfig',
        name: 'salesConfig',
        type: 'tuple',
      },
    ],
    name: 'setSale',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
];
