/* eslint-disable consistent-return */
import { NobleEd25519Signer } from '@farcaster/hub-web';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IdRegistryABI } from 'src/services/social/abi/farcaster/IdRegistryABI';
import { IdRegistryContract, OP_CHAIN_ID } from 'src/constants/farcaster';
import { useAccount, useContractRead, useNetwork } from 'wagmi';
import { useU3Login } from 'src/contexts/U3LoginContext';
import { getProfileBiolink } from 'src/services/shared/api/login';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_PLATFORMS,
} from 'src/utils/profile/biolink';
import { FarcasterBioLinkData } from './useFarcasterQR';

export default function useFarcasterWallet() {
  const { didSessionStr } = useU3Login();
  const [walletFid, setWalletFid] = useState<number>();
  const [walletSigner, setWalletSigner] = useState<NobleEd25519Signer | null>(
    null
  );
  const [walletCheckStatus, setWalletCheckStatus] = useState<string>('');
  const [fname, setFname] = useState<string>('');
  const [hasStorage, setHasStorage] = useState<boolean>(false);
  const { address } = useAccount();
  const { chain } = useNetwork();

  const { data: idOf, status } = useContractRead({
    address: IdRegistryContract,
    abi: IdRegistryABI,
    functionName: 'idOf',
    args: [address],
    enabled: Boolean(address),
    chainId: OP_CHAIN_ID,
  });

  const signerCheck = async (fid: number) => {
    if (!fid) return;
    let privateKey = localStorage.getItem(`signerPrivateKey-${fid}`);

    // if NO privateKey in local storage, try to get from db
    if (!privateKey && didSessionStr) {
      const farcasterBiolinks = await getProfileBiolink(didSessionStr, {
        platform: BIOLINK_PLATFORMS.farcaster,
        network: String(BIOLINK_FARCASTER_NETWORK),
        handle: fid,
      });
      console.log('farcasterBiolinks of wallet: ', farcasterBiolinks);
      if (farcasterBiolinks?.data?.data?.length > 0) {
        const farcasterBiolink = farcasterBiolinks.data.data[0];
        const farcasterBiolinkData =
          farcasterBiolink.data as FarcasterBioLinkData;
        if (
          farcasterBiolinkData?.privateKey &&
          farcasterBiolinkData?.publicKey
        ) {
          localStorage.setItem(
            `signerPrivateKey-${fid}`,
            farcasterBiolinkData.privateKey
          );
          localStorage.setItem(
            `signerPublicKey-${fid}`,
            farcasterBiolinkData.publicKey
          );
          privateKey = farcasterBiolinkData.privateKey;
        }
      }
    }

    if (privateKey !== null) {
      const ed25519Signer = new NobleEd25519Signer(
        Buffer.from(privateKey, 'hex')
      );
      return ed25519Signer;
    }
  };

  const fnameCheck = async (fid: number) => {
    if (!fid) return;
    try {
      const resp = await axios.get(
        `https://fnames.farcaster.xyz/transfers?fid=${fid}`
      );
      if (resp.data.transfers.length > 0) {
        return resp.data.transfers[0].username;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const storageCheck = async (fid: number) => {
    if (!fid) return;
    try {
      const resp = await axios.get(
        `https://api.farcaster.u3.xyz/v1/storageLimitsByFid?fid=${fid}`
      );
      if (resp.data.limits?.length > 0) {
        return Boolean(resp.data.limits?.[0].limit); // mainnet
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log('wallet check effect', { status, walletFid });
    if (status === 'idle') {
      setWalletCheckStatus('idle');
      return;
    }
    if (status === 'loading') return;
    if (walletFid === undefined) {
      setWalletCheckStatus('done');
      return;
    }

    setWalletCheckStatus('loading');
    console.log('wallet check start', { walletFid });
    Promise.all([
      signerCheck(walletFid),
      fnameCheck(walletFid),
      storageCheck(walletFid),
    ])
      .then((data) => {
        setWalletSigner(data[0]);
        setFname(data[1]);
        setHasStorage(data[2]);
        console.log('promise wallet check done', data);
      })
      .finally(() => {
        // TODO: timeout is wait for state to update
        setTimeout(() => {
          console.log('wallet check done');
          setWalletCheckStatus('done');
        }, 100);
      });
  }, [walletFid, status, didSessionStr]);

  useEffect(() => {
    if (idOf) {
      setWalletFid(Number(idOf));
    } else if (chain?.id !== 1) {
      setWalletFid(undefined);
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
