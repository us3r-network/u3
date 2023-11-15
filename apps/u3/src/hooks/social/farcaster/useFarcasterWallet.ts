/* eslint-disable consistent-return */
import { NobleEd25519Signer } from '@farcaster/hub-web';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { IdRegistryABI } from 'src/services/social/abi/farcaster/IdRegistryABI';
import { IdRegistryContract } from 'src/constants/farcaster';
import { useAccount } from 'wagmi';
import { createPublicClient, http } from 'viem';
import { optimism } from 'viem/chains';

import { getFarcasterUserInfo } from 'src/services/social/api/farcaster';
import { useU3Login } from 'src/contexts/U3LoginContext';
import { getProfileBiolink } from 'src/services/shared/api/login';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_PLATFORMS,
} from 'src/utils/profile/biolink';

import { FarcasterBioLinkData } from './useFarcasterQR';

const opPublicClient = createPublicClient({
  chain: optimism,
  transport: http(),
});

export default function useFarcasterWallet() {
  const { didSessionStr } = useU3Login();
  const [walletFid, setWalletFid] = useState<number>();
  const [walletSigner, setWalletSigner] = useState<NobleEd25519Signer | null>(
    null
  );
  const [walletCheckStatus, setWalletCheckStatus] = useState<string>('');
  const [fname, setFname] = useState<string>('');
  const [hasStorage, setHasStorage] = useState<boolean>(false);
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [walletUserData, setWalletUserData] = useState<
    { type: number; value: string }[]
  >([]);

  const signerCheck = (fid: number) => {
    if (!fid) return;
    const privateKey = localStorage.getItem(`signerPrivateKey-${fid}`);

    // if NO privateKey in local storage, try to get from db
    // if (!privateKey && didSessionStr) {
    //   const farcasterBiolinks = await getProfileBiolink(didSessionStr, {
    //     platform: BIOLINK_PLATFORMS.farcaster,
    //     network: String(BIOLINK_FARCASTER_NETWORK),
    //     handle: fid,
    //   });
    //   console.log('farcasterBiolinks of wallet: ', farcasterBiolinks);
    //   if (farcasterBiolinks?.data?.data?.length > 0) {
    //     const farcasterBiolink = farcasterBiolinks.data.data[0];
    //     const farcasterBiolinkData =
    //       farcasterBiolink.data as FarcasterBioLinkData;
    //     if (
    //       farcasterBiolinkData?.privateKey &&
    //       farcasterBiolinkData?.publicKey
    //     ) {
    //       localStorage.setItem(
    //         `signerPrivateKey-${fid}`,
    //         farcasterBiolinkData.privateKey
    //       );
    //       localStorage.setItem(
    //         `signerPublicKey-${fid}`,
    //         farcasterBiolinkData.publicKey
    //       );
    //       privateKey = farcasterBiolinkData.privateKey;
    //     }
    //   }
    // }

    if (privateKey) {
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

  const getCurrUserInfo = async (fid: number) => {
    const resp = await getFarcasterUserInfo([fid]);
    if (resp.data.code === 0) {
      setWalletUserData(resp.data.data);
    }
    setWalletCheckStatus('valid');
  };

  const getWalletFid = useCallback(async () => {
    const data = await opPublicClient.readContract({
      address: IdRegistryContract,
      abi: IdRegistryABI,
      functionName: 'idOf',
      args: [address],
    });
    if (!data) {
      setWalletCheckStatus('done');
      return;
    }
    const fid = Number(data);
    const checkResult = await Promise.all([
      signerCheck(fid),
      fnameCheck(fid),
      storageCheck(fid),
    ]);
    if (!checkResult[0] || !checkResult[1] || !checkResult[2]) {
      setWalletCheckStatus('done');
      return;
    }

    setWalletFid(fid);
    setWalletSigner(checkResult[0]);
    setFname(checkResult[1]);
    setHasStorage(checkResult[2]);
    getCurrUserInfo(fid);
  }, [address]);

  useEffect(() => {
    if (!mounted) return;
    if (!isConnected) {
      setWalletCheckStatus('done');
      return;
    }
    getWalletFid();
  }, [getWalletFid, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    walletCheckStatus,
    walletSigner,
    setWalletSigner,
    fname,
    hasStorage,
    walletFid,
    walletUserData,
  };
}
