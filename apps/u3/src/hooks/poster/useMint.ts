import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
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
  const { data: mintFee } = useContractRead({
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
  const { config: prepareConfig } = usePrepareContractWrite(prepareOpts);

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
    data,
    isError: writeError || transationError,
    isLoading: writing || waiting,
    isSuccess,
    status,
  };
}

export default useMint;
