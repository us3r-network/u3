import { ComponentPropsWithRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  simulateContract,
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { useAccount, useConfig, usePublicClient } from 'wagmi';
import { optimism } from 'viem/chains';

import useLogin from '@/hooks/shared/useLogin';
import { RentContract } from './Contract';
import Title from './Title';
import { cn } from '@/lib/utils';

export default function RentStorage({
  fid,
  hasStorage,
  setHasStorage,
  className,
  ...props
}: ComponentPropsWithRef<'div'> & {
  fid: number;
  hasStorage: boolean;
  setHasStorage: (h: boolean) => void;
}) {
  const { openConnectModal } = useConnectModal();
  const { address, chain } = useAccount();
  const config = useConfig();
  const { isLogin, login } = useLogin();
  const publicClient = usePublicClient({
    chainId: optimism.id,
  });

  const rentStorage = useCallback(async () => {
    if (chain?.id !== optimism.id) {
      await switchChain(config, { chainId: optimism.id });
    }
    const balance = await publicClient.getBalance({ address });
    console.log('balance', balance);

    const price = await publicClient.readContract({
      ...RentContract,
      functionName: 'unitPrice',
    });
    console.log('rent price', price);
    if (balance < price) {
      toast.error('You have not enough balance.');
      return;
    }
    try {
      const { request: RentRequest } = await simulateContract(config, {
        ...RentContract,
        functionName: 'rent',
        args: [fid, 1], // keyType, publicKey, metadataType, metadata
        value: price,
        enabled: Boolean(price),
      });
      const rentTxHash = await writeContract(config, RentRequest);
      const rentTxReceipt = await waitForTransactionReceipt(config, {
        hash: rentTxHash,
        chainId: optimism.id,
      });
      console.log('registerTxReceipt', rentTxReceipt);
      // Now extract the FID from the logs
      setHasStorage(true);
    } catch (e) {
      console.error(e);
      toast.error(e.message.split('\n')[0]);
    }
  }, [chain, address]);

  return (
    <div
      className={cn(
        'text-white flex flex-col border border-[#39424c] rounded-2xl',
        'p-5 h-[350px] w-[320px]',
        className
      )}
      {...props}
    >
      <Title checked={!!fid && hasStorage} text={'Step 4'} />
      <div className="italic py-5 text-xl font-bold border-b border-[#39424c]">
        Rent storage
      </div>

      <div className="mt-5 flex-grow flex flex-col">
        {(fid && hasStorage && (
          <div className="flex flex-col gap-3 text-xl">
            <p>Your have the storage.</p>
          </div>
        )) || (
          <div className="flex flex-col justify-between gap-3 text-xl flex-grow">
            <p>Renting to store casts.</p>

            {(fid && !hasStorage && (
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
                    await rentStorage();
                  }}
                >
                  Rent
                </button>
              </div>
            )) ||
              null}
          </div>
        )}
      </div>
    </div>
  );
}
