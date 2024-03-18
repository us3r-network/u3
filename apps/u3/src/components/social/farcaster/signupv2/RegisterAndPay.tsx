import { ComponentPropsWithRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { idRegistryABI } from '@farcaster/hub-web';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { useAccount, useConfig, usePublicClient } from 'wagmi';
import { optimism } from 'viem/chains';
import { decodeEventLog } from 'viem';

import useLogin from '@/hooks/shared/useLogin';
import { IdContract, IdGateway, RECOVERY_ADDRESS } from './Contract';
import Title from './Title';
import { cn } from '@/lib/utils';
import { shortAddress } from '@/utils/message/xmtp';

export default function RegisterAndPay({
  fid,
  setFid,
  className,
  ...props
}: ComponentPropsWithRef<'div'> & {
  fid: number;
  setFid: (fid: number) => void;
}) {
  const { openConnectModal } = useConnectModal();
  const { address, chain } = useAccount();
  const config = useConfig();
  const { isLogin, login } = useLogin();
  const publicClient = usePublicClient({
    chainId: optimism.id,
  });
  const registerAndPay = useCallback(async () => {
    if (chain?.id !== optimism.id) {
      switchChain(config, { chainId: optimism.id });
    }
    const balance = await publicClient.getBalance({ address });
    console.log('balance', balance);
    const existingFid = await publicClient.readContract({
      ...IdContract,
      functionName: 'idOf',
      args: [address],
    });
    console.log('existingFid', existingFid);
    if (existingFid > 0n) {
      setFid(Number(existingFid));
      return;
    }
    const price = await publicClient.readContract({
      ...IdGateway,
      functionName: 'price',
    });
    console.log('register price', price);
    if (balance < price) {
      toast.error('You have not enough balance.');
      return;
    }
    try {
      const { request: registerRequest } = await publicClient.simulateContract({
        ...IdGateway,
        functionName: 'register',
        args: [RECOVERY_ADDRESS],
        value: price,
      });
      const registerTxHash = await writeContract(config, registerRequest);
      const registerTxReceipt = await waitForTransactionReceipt(config, {
        hash: registerTxHash,
        chainId: optimism.id,
      });
      console.log('registerTxReceipt', registerTxReceipt);
      // Now extract the FID from the logs
      const registerLog: any = decodeEventLog({
        abi: idRegistryABI,
        data: registerTxReceipt.logs[0].data,
        topics: registerTxReceipt.logs[0].topics,
      });
      console.log('registerLog', registerLog);
      const fidRegister = parseInt(registerLog.args.id, 10);
      console.log('fidRegister', fidRegister);
      setFid(fidRegister);
    } catch (e) {
      console.error(e);
      toast.error(e.message);
    }
    // const idGateway = readContract(IdGateway);
  }, [chain, address, config]);

  return (
    <div
      className={cn(
        'text-white flex flex-col border border-[#39424c] rounded-2xl',
        'p-5 h-[350px] w-[320px]',
        className
      )}
      {...props}
    >
      <Title checked={!!fid} text={'Step 1'} />
      <div className="italic py-5 text-xl font-bold border-b border-[#39424c]">
        Register a new Farcaster ID
      </div>

      <div className="mt-5 flex-grow flex flex-col">
        {(fid && (
          <div className="flex flex-col gap-3 text-xl">
            <p>Your FID is:</p>
            <div className="font-bold">{fid}</div>
          </div>
        )) || (
          <div className="flex flex-col justify-between gap-3 text-xl flex-grow">
            <p>
              Register a new Farcaster ID with{' '}
              <span className="font-bold">{shortAddress(address)}</span>
            </p>

            <div className="text-end">
              <button
                type="button"
                className="bg-white py-2 px-3  font-bold text-base text-black cursor-pointer rounded-lg border-none outline-none"
                onClick={async () => {
                  if (!isLogin) {
                    login();
                    return;
                  }
                  if (!address) {
                    openConnectModal();
                  }
                  await registerAndPay();
                }}
              >
                Register Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
