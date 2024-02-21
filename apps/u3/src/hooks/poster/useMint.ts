import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { utils } from 'ethers';
import {
  ZoraCreator1155ImplAbi,
  casterZora1155ToMintAddress,
  casterZoraFixedPriceStrategyAddress,
  casterRecipientAddress,
  casterZoraChainId,
} from '../../constants/zora';
import { getZoraMintFeeWithChain } from '@/utils/shared/zora';

export function useMint({
  tokenId,
  owner,
}: {
  tokenId: number;
  owner: string;
}) {
  const { data: mintFee } = useReadContract({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'mintFee',
  });

  const fee = getZoraMintFeeWithChain(casterZoraChainId, mintFee);

  const prepareOpts = {
    address: casterZora1155ToMintAddress, // address of collection to mint from
    abi: ZoraCreator1155ImplAbi,
    functionName: 'mintWithRewards',
    args: [
      casterZoraFixedPriceStrategyAddress, // `minter` contract to use
      tokenId, // `tokenId` hardcoded as 1
      1, // `mintQuantity` hardcoded as 1
      utils.defaultAbiCoder.encode(['address'], [owner]) as `0x${string}`,
      casterRecipientAddress,
    ],
    value: fee,
    enabled: !!tokenId && !!mintFee,
  };
  const { data: simulateData } = useSimulateContract(prepareOpts);

  const {
    writeContract,
    data: writeData,
    isPending: writing,
    isError: writeError,
  } = useWriteContract();

  const {
    data,
    isError: transationError,
    isLoading: waiting,
    isSuccess,
    status,
  } = useWaitForTransactionReceipt({
    hash: writeData,
  });

  return {
    write: () => writeContract(simulateData.request),
    data,
    isError: writeError || transationError,
    isLoading: writing || waiting,
    isSuccess,
    status,
  };
}

export default useMint;
