import { useAccount, useConfig, useWalletClient } from 'wagmi';
import { toHex } from 'viem';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useCallback, useState } from 'react';
import { NobleEd25519Signer, ViemWalletEip712Signer } from '@farcaster/hub-web';
import { switchChain } from '@wagmi/core';
import { mainnet } from 'viem/chains';

import { cn } from '@/lib/utils';

import Title from './Title';
import { Input } from '@/components/ui/input';
import useLogin from '@/hooks/shared/useLogin';

export default function AddAccountKey({
  fid,
  fname,
  signer,
  setFname,
  makePrimaryName,
}: {
  fid: number;
  fname: string;
  signer?: NobleEd25519Signer;
  setFname: (n: string) => void;
  makePrimaryName: (n: string) => Promise<void>;
}) {
  const { openConnectModal } = useConnectModal();
  const { isLogin, login } = useLogin();
  const { address, chain } = useAccount();
  const config = useConfig();
  const wallet = useWalletClient();
  const [name, setName] = useState(fname || '');

  const registerFname = useCallback(async () => {
    if (!fid) {
      return;
    }
    try {
      const response = await axios.get(
        `https://fnames.farcaster.xyz/transfers/current?fid=${fid}`
      );
      const fnameExist = response.data.transfer.username;
      if (fnameExist) {
        console.log(`Fid ${fid} already has fname: ${fnameExist}`);
        setFname(fnameExist);
        return;
      }
    } catch (e) {
      // console.log(e);
    }

    if (chain?.id !== mainnet.id) {
      await switchChain(config, { chainId: mainnet.id });
    }

    console.log('signUserNameProofClaim', name, address, fid);
    const eip712signer = new ViemWalletEip712Signer(wallet.data as any);
    const timestamp = Math.floor(Date.now() / 1000);
    const userNameProofSignature = await eip712signer.signUserNameProofClaim({
      name,
      timestamp: BigInt(timestamp),
      owner: address,
    });
    if (userNameProofSignature.isErr()) {
      toast.error(userNameProofSignature.error.message);
      return;
    }

    const userNameProofSignatureHex = toHex(
      userNameProofSignature.unwrapOr(new Uint8Array())
    );

    const { data } = await axios.post(
      'https://fnames.farcaster.xyz/transfers',
      {
        name, // Name to register
        from: 0, // Fid to transfer from (0 for a new registration)
        to: fid, // Fid to transfer to (0 to unregister)
        fid, // Fid making the request (must match from or to)
        owner: address, // Custody address of fid making the request
        timestamp, // Current timestamp in seconds
        signature: userNameProofSignatureHex,
      }
    );
    toast.success('Fname registered!');
    console.log(data);
    setTimeout(() => {
      makePrimaryName(name);
    }, 1000);
    setFname(name);
  }, [name, address, fid, wallet, makePrimaryName, setFname]);

  return (
    <div
      className={cn(
        'text-white flex flex-col border border-[#39424c] rounded-2xl',
        'p-5 h-[350px] w-[320px]'
      )}
    >
      <Title checked={!!fid && !!fname} text={'Step 3'} />
      <div className="italic py-5 text-xl font-bold border-b border-[#39424c]">
        Register an fname
      </div>

      <div className="mt-5 flex-grow flex flex-col">
        {(fid && fname && (
          <div className="flex flex-col justify-between text-xl flex-grow">
            <div className="flex flex-col gap-3 text-xl">
              <p>Your Fname is:</p>
              <div className="font-bold">{fname}</div>
            </div>
            <div className="text-end">
              <button
                type="button"
                className="bg-white py-2 px-3 font-bold text-base text-black cursor-pointer rounded-lg border-none outline-none"
                onClick={async () => {
                  if (!isLogin) {
                    login();
                    return;
                  }
                  if (!address) {
                    openConnectModal();
                    return;
                  }
                  await makePrimaryName(fname);
                }}
              >
                MakeFnamePrimary
              </button>
            </div>
          </div>
        )) || (
          <div className="flex flex-col justify-between text-xl flex-grow">
            <div>
              <p className="mb-3">
                Acquire a free offchain ENS username issued by Farcster.
              </p>
              {(fid && signer && (
                <Input
                  type="text"
                  placeholder="fname"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              )) ||
                null}
            </div>
            <div className="text-end">
              {(fid && signer && (
                <button
                  type="button"
                  className="bg-white py-2 px-3 font-normal text-base text-black cursor-pointer rounded-lg border-none outline-none"
                  onClick={async () => {
                    if (!isLogin) {
                      login();
                      return;
                    }
                    if (!address) {
                      openConnectModal();
                      return;
                    }
                    await registerFname();
                  }}
                >
                  Register
                </button>
              )) ||
                null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
