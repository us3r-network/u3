import {
  useReadContract,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import dayjs from 'dayjs';
import {
  ZoraCreator1155ImplAbi,
  ZoraCreatorFixedPriceSaleStrategyAbi,
  casterZora1155ToMintAddress,
  casterZoraFixedPriceStrategyAddress,
} from '../../constants/zora';

const NO_RECIPIENT =
  '0x0000000000000000000000000000000000000000' as `0x${string}`;
// hardcoded inputs for creating new token config
const create1155Input = {
  fixedPriceStrategyAddress: '', // hardcoded address of fixed price strategy minter on goerli
  maxSupply: BigInt('18446744073709551615'), // value to create edition with no supply cap
  mintLimit: 1, // no mint limit per wallet
  nextTokenId: 0, // default to be overriden
  price: BigInt(0), // free to mint
  saleEnd: BigInt('18446744073709551615'), // "forever edition value"
  saleStart: BigInt(Math.floor(dayjs().valueOf() / 1000)), // sale begins at today
  tokenURI: '', // example metadata for 1155 token can be seen here: https://ipfs.io/ipfs/bafkreifdyhfe7fyysnu5oqoewgrnry4ot74ttrz5kpkkpl7ln77ooowog4
  royaltyBPS: 0, // no secondary royalties
  royaltyRecipient: NO_RECIPIENT, // no royalty recipient
  autoSupplyInterval: 0, // no auto supply royalties
};
function constructCreate1155Calls({
  fixedPriceStrategyAddress,
  maxSupply,
  mintLimit,
  nextTokenId,
  price,
  saleEnd,
  saleStart,
  tokenURI,
  royaltyBPS,
  royaltyRecipient,
  autoSupplyInterval,
}: {
  fixedPriceStrategyAddress: `0x${string}`;
  maxSupply: bigint;
  nextTokenId: number;
  price?: bigint;
  saleEnd?: bigint;
  saleStart?: bigint;
  mintLimit?: number;
  tokenURI: string;
  royaltyBPS: number;
  royaltyRecipient: `0x${string}`;
  autoSupplyInterval: number;
}): `0x${string}`[] {
  if (!royaltyRecipient) {
    royaltyRecipient = NO_RECIPIENT;
  }

  if (royaltyRecipient === NO_RECIPIENT) {
    autoSupplyInterval = 0;
  }

  const setupActions = [
    encodeFunctionData({
      abi: ZoraCreator1155ImplAbi,
      functionName: 'assumeLastTokenIdMatches',
      args: [nextTokenId - 1],
    }),
    encodeFunctionData({
      abi: ZoraCreator1155ImplAbi,
      functionName: 'setupNewToken',
      args: [tokenURI, maxSupply],
    }),
    encodeFunctionData({
      abi: ZoraCreator1155ImplAbi,
      functionName: 'addPermission',
      args: [
        nextTokenId,
        fixedPriceStrategyAddress,
        2 ** 2, // PERMISSION_BIT_MINTER
      ],
    }),
    encodeFunctionData({
      abi: ZoraCreator1155ImplAbi,
      functionName: 'callSale',
      args: [
        nextTokenId,
        fixedPriceStrategyAddress,
        encodeFunctionData({
          abi: ZoraCreatorFixedPriceSaleStrategyAbi,
          functionName: 'setSale',
          args: [
            nextTokenId,
            {
              pricePerToken: price,
              saleStart,
              saleEnd,
              maxTokensPerAddress: mintLimit,
              fundsRecipient: NO_RECIPIENT,
            },
          ],
        }),
      ],
    }),
  ];

  if (royaltyBPS > 0 && royaltyRecipient !== NO_RECIPIENT) {
    setupActions.push(
      encodeFunctionData({
        abi: ZoraCreator1155ImplAbi,
        functionName: 'updateRoyaltiesForToken',
        args: [
          nextTokenId,
          {
            royaltyBPS,
            royaltyRecipient,
            royaltyMintSchedule: autoSupplyInterval,
          },
        ],
      })
    );
  }
  return setupActions;
}

export function useCreate1155Token({ tokenURI }: { tokenURI: string }) {
  const { data: nextTokenId } = useReadContract({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'nextTokenId',
  });
  console.log('nextTokenId', nextTokenId);

  const create1155Calls =
    nextTokenId && !!tokenURI
      ? constructCreate1155Calls({
          ...create1155Input,
          nextTokenId: Number(nextTokenId),
          tokenURI,
          fixedPriceStrategyAddress: casterZoraFixedPriceStrategyAddress,
        })
      : null;
  const { data: simulateData } = useSimulateContract({
    address: casterZora1155ToMintAddress, // address of collection to mint new token to
    abi: ZoraCreator1155ImplAbi,
    functionName: 'multicall',
    args: [create1155Calls],
    enabled: !!create1155Calls,
  });
  const {
    writeContract,
    data: writeData,
    isPending: writing,
    isError: writeIsError,
  } = useWriteContract();
  const {
    data,
    isError: transationIsError,
    isLoading: trading,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    write: () => writeContract(simulateData.request),
    nextTokenId,
    data,
    writing,
    trading,
    isError: writeIsError || transationIsError,
    isLoading: writing || trading,
    isSuccess,
    status,
  };
}

export default useCreate1155Token;
