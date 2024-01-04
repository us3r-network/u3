import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useContractRead,
} from 'wagmi';
import { BigNumber, utils } from 'ethers';
import {
  ZoraCreator1155ImplAbi,
  casterZora1155ToMintAddress,
  casterZoraFixedPriceStrategyAddress,
  casterRecipientAddress,
} from '../../constants/zora';

export function useMint({ tokenId }: { tokenId: number }) {
  const { data: mintFee } = useContractRead({
    address: casterZora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'mintFee',
  });
  console.log('mintFee', mintFee);
  const wei = BigNumber.from(mintFee);
  const mintValue = utils.formatUnits(wei, 'ether');
  console.log('mintEth', mintValue);

  const prepareOpts = {
    address: casterZora1155ToMintAddress, // address of collection to mint from
    abi: ZoraCreator1155ImplAbi,
    functionName: 'mintWithRewards',
    args: [
      casterZoraFixedPriceStrategyAddress, // `minter` contract to use
      tokenId, // `tokenId` hardcoded as 1
      1, // `mintQuantity` hardcoded as 1
      utils.defaultAbiCoder.encode(
        ['address'],
        [casterRecipientAddress]
      ) as `0x${string}`,
      casterRecipientAddress,
    ],
    // value: mintFee,
    value: mintValue,
    enabled: !!tokenId && !!mintFee,
  };
  console.log('prepareOpts', prepareOpts);
  const { config: prepareConfig } = usePrepareContractWrite(prepareOpts);
  console.log('prepareConfig', prepareConfig);

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
