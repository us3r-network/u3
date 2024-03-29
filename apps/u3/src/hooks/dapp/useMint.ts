/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:08:17
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 13:40:22
 * @FilePath: /u3/apps/u3/src/hooks/dapp/useMint.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { utils } from 'ethers';
import {
  ZoraCreator1155ImplAbi,
  zora1155ToMintAddress,
  zoraFixedPriceStrategyAddress,
  recipientAddress,
} from '../../constants/zora';

export type TokenInfo = {
  uri: string;
  maxSupply: number;
  totalMinted: number;
};

export function useMint(tokenId) {
  const { data: mintFee } = useReadContract({
    address: zora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'mintFee',
  });
  const { data: tokenInfo } = useReadContract({
    address: zora1155ToMintAddress,
    abi: ZoraCreator1155ImplAbi,
    functionName: 'getTokenInfo',
    args: [tokenId],
  });

  const { data: simulateData } = useSimulateContract({
    address: zora1155ToMintAddress, // address of collection to mint from
    abi: ZoraCreator1155ImplAbi,
    functionName: 'mintWithRewards',
    args: [
      zoraFixedPriceStrategyAddress, // `minter` contract to use
      tokenId, // `tokenId` hardcoded as 1
      1, // `mintQuantity` hardcoded as 1
      utils.defaultAbiCoder.encode(
        ['address'],
        [recipientAddress]
      ) as `0x${string}`,
      recipientAddress,
    ],
    value: mintFee,
    enabled: !!tokenId && !!mintFee,
  });
  // console.log('prepareConfig', prepareConfig, mintFee, tokenInfo);
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
    tokenInfo,
    write: () => writeContract(simulateData.request),
    data,
    isError: writeError || transationError,
    isLoading: writing || waiting,
    isSuccess,
    status,
  };
}

export default useMint;
