/* eslint-disable no-underscore-dangle */
import { useCallback } from 'react';
import { createWalletClient, custom, fromHex, toHex } from 'viem';
import { optimism } from 'viem/chains';
import { toast } from 'react-toastify';
import { NobleEd25519Signer, ViemWalletEip712Signer } from '@farcaster/hub-web';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import {
  waitForTransaction,
  writeContract,
  prepareWriteContract,
} from '@wagmi/core';
import * as ed25519 from '@noble/ed25519';

import { cn } from '@/lib/utils';
import useLogin from '@/hooks/shared/useLogin';

import Title from './Title';
import { KeyContract } from './Contract';
import {
  getDefaultFarcaster,
  setDefaultFarcaster,
} from '@/utils/social/farcaster/farcaster-default';

export default function AddAccountKey({
  fid,
  signer,
  setSigner,
}: {
  fid: number;
  signer: NobleEd25519Signer | null;
  setSigner: (s: NobleEd25519Signer | null) => void;
}) {
  const { openConnectModal } = useConnectModal();
  const { isLogin, login } = useLogin();
  const { address } = useAccount();
  const account = useAccount();
  const wallet = useWalletClient();

  const publicClient = usePublicClient({
    chainId: optimism.id,
  });

  const addSigner = useCallback(async () => {
    if (!fid) {
      return;
    }
    console.log('addSigner', fid);
    const signerPublicKeyLocalStorageKey = `signerPublicKey-${fid}`;
    const signerPrivateKeyLocalStorageKey = `signerPrivateKey-${fid}`;
    const existingPrivateKey = localStorage.getItem(
      signerPrivateKeyLocalStorageKey
    );
    if (existingPrivateKey) {
      const ed25519Signer = new NobleEd25519Signer(
        Buffer.from(existingPrivateKey, 'hex')
      );
      setSigner(ed25519Signer);
      return;
    }
    // const privateKey = ed25519.utils.randomPrivateKey();
    // const publicKey = toHex(ed25519.getPublicKey(privateKey));
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = toHex(await ed25519.getPublicKeyAsync(privateKey));

    console.log('publicKey', publicKey);
    console.log(
      `Created new signer for test with private key: ${toHex(privateKey)}`
    );
    // const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60);
    const client = createWalletClient({
      account: wallet.data.account,
      transport: custom((window as any).ethereum),
    });
    // console.log('client', client.account.address);
    const eip712signer = new ViemWalletEip712Signer(client);
    const metadata = await eip712signer.getSignedKeyRequestMetadata({
      requestFid: BigInt(fid),
      key: fromHex(publicKey, 'bytes'),
      deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 60), // 1 hour from now
    });

    if (metadata.isErr()) {
      toast.error(metadata.error.message);
      return;
    }

    const metadataHex = toHex(metadata.unwrapOr(new Uint8Array()));

    try {
      const { request: signerAddRequest } = await prepareWriteContract({
        ...KeyContract,
        functionName: 'add',
        args: [1, publicKey, 1, metadataHex], // keyType, publicKey, metadataType, metadata
        enabled: Boolean(metadata),
      });

      const signerAddTxHash = await writeContract(signerAddRequest);
      const signerAddTxReceipt = await waitForTransaction({
        hash: signerAddTxHash.hash,
        chainId: optimism.id,
      });
      console.log('signerAddTxReceipt', signerAddTxReceipt);

      if (!getDefaultFarcaster()) {
        setDefaultFarcaster(`${fid}`);
      }

      localStorage.setItem(signerPublicKeyLocalStorageKey, publicKey);
      localStorage.setItem(
        signerPrivateKeyLocalStorageKey,
        ed25519.etc.bytesToHex(privateKey)
      );
      const ed25519Signer = new NobleEd25519Signer(privateKey);
      setSigner(ed25519Signer);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }, [fid, account, publicClient]);

  return (
    <div
      className={cn(
        'text-white flex flex-col border border-[#39424c] rounded-2xl',
        'p-5 h-[350px] w-[320px]'
      )}
    >
      <Title checked={!!fid && !!signer} text={'Step 2'} />
      <div className="italic py-5 text-xl font-bold border-b border-[#39424c]">
        Add a signer
      </div>

      <div className="mt-5 flex-grow flex flex-col">
        {(fid && signer && (
          <div className="flex flex-col gap-3 text-xl">
            <p>Signer added</p>
          </div>
        )) || (
          <div className="flex flex-col justify-between gap-3 text-xl flex-grow">
            <p>
              A signer is a key pair that lets you create new message or “casts”
            </p>

            {(fid && (
              <div className="text-end">
                <button
                  type="button"
                  className="bg-white py-2 px-5  font-bold text-base text-black cursor-pointer rounded-lg border-none outline-none"
                  onClick={() => {
                    if (!isLogin) {
                      login();
                      return;
                    }
                    if (!address) {
                      openConnectModal();
                      return;
                    }
                    addSigner();
                  }}
                >
                  Add
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
