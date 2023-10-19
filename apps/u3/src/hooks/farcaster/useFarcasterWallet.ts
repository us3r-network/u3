/* eslint-disable consistent-return */
import { NobleEd25519Signer } from '@farcaster/hub-web';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { IdRegistryABI } from 'src/abi/IdRegistryABI';
import { useAccount, useContractRead, useNetwork } from 'wagmi';

export default function useFarcasterWallet() {
  const [walletFid, setWalletFid] = useState<number>(0);
  const [walletSigner, setWalletSigner] = useState<NobleEd25519Signer | null>(
    null
  );
  const [walletCheckStatus, setWalletCheckStatus] = useState<string>('');
  const [fname, setFname] = useState<string>('');
  const [hasStorage, setHasStorage] = useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: idOf, status } = useContractRead({
    address: '0x00000000FcAf86937e41bA038B4fA40BAA4B780A',
    abi: IdRegistryABI,
    functionName: 'idOf',
    args: [address],
    enabled: Boolean(address),
    chainId: 10,
  });

  const signerCheck = useCallback(() => {
    if (!walletFid) return;
    const privateKey = localStorage.getItem(`signerPrivateKey-${walletFid}`);
    if (privateKey !== null) {
      const ed25519Signer = new NobleEd25519Signer(
        Buffer.from(privateKey, 'hex')
      );
      return ed25519Signer;
    }
  }, [walletFid]);

  const fnameCheck = useCallback(async () => {
    if (!walletFid) return;
    try {
      const resp = await axios.get(
        `https://fnames.farcaster.xyz/transfers?fid=${walletFid}`
      );
      if (resp.data.transfers.length > 0) {
        return resp.data.transfers[0].username;
      }
    } catch (error) {
      console.log(error);
    }
  }, [walletFid]);

  const storageCheck = useCallback(async () => {
    if (!walletFid) return;
    try {
      const resp = await axios.get(
        `https://api.farcaster.u3.xyz/v1/storageLimitsByFid?fid=${walletFid}`
      );
      if (resp.data.limits?.length > 0) {
        return Boolean(resp.data.limits?.[0].limit); // mainnet
      }
    } catch (error) {
      console.log(error);
    }
  }, [walletFid]);

  useEffect(() => {
    if (status === 'loading') return;
    setWalletCheckStatus('loading');
    Promise.all([signerCheck(), fnameCheck(), storageCheck()])
      .then((data) => {
        setWalletSigner(data[0]);
        setFname(data[1]);
        setHasStorage(data[2]);
      })
      .finally(() => {
        // TODO: timeout is wait for state to update
        setTimeout(() => {
          setWalletCheckStatus('done');
        }, 100);
      });
  }, [signerCheck, fnameCheck, storageCheck, status]);

  useEffect(() => {
    // eslint-disable-next-line  @typescript-eslint/no-base-to-string
    console.log(`Your FID is: ${idOf}`);
    if (idOf) {
      setWalletFid(Number(idOf));
    } else if (chain?.id !== 1) {
      setWalletFid(0);
    }
  }, [chain?.id, idOf]);

  return {
    walletCheckStatus,
    walletSigner,
    setWalletSigner,
    fname,
    hasStorage,
    walletFid,
  };
}
