import {
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  // useNetwork,
} from 'wagmi';
import { encodeFunctionData } from 'viem';
import {
  ZoraCreator1155ImplAbi,
  ZoraCreatorFixedPriceSaleStrategyAbi,
  zora1155ToMintAddress,
  zoraFixedPriceStrategyAddress,
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
  saleStart: BigInt(0), // sale begins at unix time = 0 (1970 ish)
  tokenURI: '', // example metadata for 1155 token can be seen here: https://ipfs.io/ipfs/bafkreifdyhfe7fyysnu5oqoewgrnry4ot74ttrz5kpkkpl7ln77ooowog4
  royaltyBPS: 0, // no secondary royalties
  royaltyRecipient: NO_RECIPIENT, // no royalty recipient
  autoSupplyInterval: 0, // no auto supply royalties
};

export function useCreate1155Token(newTokenURI) {
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
      autoSupplyInterval = 0;
    }
    const verifyTokenIdExpected = encodeFunctionData({
      abi: ZoraCreator1155ImplAbi,
      functionName: 'assumeLastTokenIdMatches',
      args: [nextTokenId - 1],
    });
    const setupNewToken = encodeFunctionData({
      abi: ZoraCreator1155ImplAbi,
      functionName: 'setupNewToken',
      args: [tokenURI, maxSupply],
    });

    let royaltyConfig = null;
    if (royaltyBPS > 0 && royaltyRecipient !== NO_RECIPIENT) {
      royaltyConfig = encodeFunctionData({
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
      });
    }

    const contractCalls = [
      verifyTokenIdExpected,
      setupNewToken,
      royaltyConfig,
    ].filter((item) => item !== null) as `0x${string}`[];

    if (typeof price !== 'undefined') {
      const fixedPriceApproval = encodeFunctionData({
        abi: ZoraCreator1155ImplAbi,
        functionName: 'addPermission',
        args: [
          nextTokenId,
          fixedPriceStrategyAddress,
          2 ** 2, // PERMISSION_BIT_MINTER
        ],
      });

      const saleData = encodeFunctionData({
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
      });

      const callSale = encodeFunctionData({
        abi: ZoraCreator1155ImplAbi,
        functionName: 'callSale',
        args: [nextTokenId, fixedPriceStrategyAddress, saleData],
      });

      return [
        ...contractCalls,
        fixedPriceApproval,
        callSale,
      ] as `0x${string}`[];
    }

    return contractCalls;
  }
  // const { chain, chains } = useNetwork();
  // console.log(
  //   'useContractRead',
  //   zora1155ToMintAddress,
  //   chain,
  //   chains
  // );
  const { data: nextTokenId } = useContractRead({
    address: zora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'nextTokenId',
  });
  console.log('nextTokenId', nextTokenId);
  const create1155Calls =
    nextTokenId && newTokenURI !== ''
      ? constructCreate1155Calls({
          ...create1155Input,
          nextTokenId: Number(nextTokenId),
          tokenURI: newTokenURI,
          fixedPriceStrategyAddress: zoraFixedPriceStrategyAddress,
        })
      : null;
  // console.log('create1155Calls', create1155Calls);
  const { config: prepareConfig } = usePrepareContractWrite({
    address: zora1155ToMintAddress, // address of collection to mint new token to
    abi: ZoraCreator1155ImplAbi,
    functionName: 'multicall',
    args: [create1155Calls],
    enabled: !!create1155Calls,
  });
  // console.log('prepareConfig', prepareConfig);
  const {
    write,
    data: writeData,
    isLoading: writing,
    isError: writeError,
  } = useContractWrite(prepareConfig);
  const {
    data,
    isError: transationError,
    isLoading: waiting,
    isSuccess,
    status,
  } = useWaitForTransaction({
    hash: writeData?.hash,
  });

  return {
    write,
    nextTokenId,
    data,
    isError: writeError || transationError,
    isLoading: writing || waiting,
    isSuccess,
    status,
  };
}

export default useCreate1155Token;
