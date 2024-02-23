/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import {
  generateKeyPair,
  getSignedKeyRequest,
  getTempFarsignPrivateKey,
  getTempFarsignPubkey,
  removeFarsignPrivateKey,
  removeFarsignSigner,
  removeTempFarsignPrivateKey,
  removeTempFarsignPubkey,
  saveTempFarsignPrivateKey,
  saveTempFarsignPubkey,
  setPrivateKey,
  setSignedKeyRequest,
} from 'src/utils/social/farcaster/farsign-utils';
import { WARPCAST_API } from 'src/constants/farcaster';
import {
  fetchSignerWithPubkey,
  getFarcasterSignature,
  getFarcasterUserInfo,
} from 'src/services/social/api/farcaster';
import { useU3Login } from 'src/contexts/U3LoginContext';
import {
  FarcasterSignerType,
  getProfileBiolink,
  postProfileBiolink,
} from 'src/services/shared/api/login';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_PLATFORMS,
} from 'src/utils/profile/biolink';
import {
  getDefaultFarcaster,
  setDefaultFarcaster,
} from '@/utils/social/farcaster/farcaster-default';
import useLogin from '@/hooks/shared/useLogin';

const stopSign = {
  stop: false,
};

export type Token = {
  token: string;
  deepLink: string;
};

export type SignedKeyRequestData = {
  deeplinkUrl: string;
  key: string;
  requestFid: number;
  state: 'completed' | 'pending' | 'approved';
  token: string;
  userFid: number;
};

export type Signer = {
  SignedKeyRequest: SignedKeyRequestData;
  isConnected: boolean;
};

export type FarcasterBioLinkData = {
  privateKey: string;
  publicKey?: string;
  signedKeyRequest?: string;
};

export default function useFarcasterQR() {
  const { didSessionStr } = useU3Login();
  const { walletAddress } = useLogin();
  const [qrFid, setQrFid] = useState<number>();
  const [openQR, setOpenQR] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [warpcastErr, setWarpcastErr] = useState<string>('');
  const [qrSigner, setQrSigner] = useState<Signer>({
    SignedKeyRequest: {
      deeplinkUrl: '',
      key: '',
      requestFid: 0,
      state: 'pending',
      token: '',
      userFid: 0,
    },
    isConnected: false,
  });
  const [token, setToken] = useState<Token>({
    token: '',
    deepLink: '',
  });
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [qrCheckStatus, setQrCheckStatus] = useState<string>('');
  const [qrUserData, setQrUserData] = useState<
    { type: number; value: string }[]
  >([]);

  const pollForSigner = useCallback(async (token: string, keyPair) => {
    let tries = 0;

    let signerSuccess = false;
    let stopped = false;

    while (tries < 60) {
      if (stopSign.stop) {
        stopped = true;
        break;
      }
      tries += 1;
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = await axios
        .get(`${WARPCAST_API}/v2/signed-key-request`, {
          params: {
            token,
          },
        })
        .then((response) => response.data.result);

      const { signedKeyRequest } = result;

      if (signedKeyRequest.state === 'completed') {
        setSignedKeyRequest(signedKeyRequest);
        setPrivateKey(keyPair.privateKey);

        removeTempFarsignPrivateKey();
        removeTempFarsignPubkey();

        if (!getDefaultFarcaster()) {
          setDefaultFarcaster(`${signedKeyRequest.userFid}`);
        }
        restoreFromQRcode();
        signerSuccess = true;
        // wirte to u3 db
        postProfileBiolink(
          {
            platform: BIOLINK_PLATFORMS.farcaster,
            network: String(BIOLINK_FARCASTER_NETWORK),
            handle: signedKeyRequest.userFid,
            data: {
              farcasterSignerType: FarcasterSignerType.QR,
              privateKey: keyPair.privateKey,
              publicKey: keyPair.publicKey,
              signedKeyRequest,
            },
          },
          didSessionStr
        );
        break;
      }
    }

    if (signerSuccess) {
      toast.success('Warpcast connected');
    } else if (!stopped) {
      toast.error('Warpcast connect failed');
    }

    setTimeout(() => {
      setOpenQR(false);
    }, 500);
  }, []);

  const getCurrUserInfo = async (fid: number) => {
    const resp = await getFarcasterUserInfo([fid]);
    if (resp.data.code === 0) {
      setQrUserData(resp.data.data);
    }
    setQrCheckStatus('valid');
  };

  const initWarpcastAuth = useCallback(async () => {
    const keyPair = await generateKeyPair();
    const convertedKey = `0x${keyPair.publicKey}`;

    const resp = await getFarcasterSignature(convertedKey);
    if (resp.status !== 200) {
      setWarpcastErr('Internal server error');
      return;
    }

    const { signature, appFid, deadline } = resp.data.data;

    const { token, deeplinkUrl } = await axios
      .post(`${WARPCAST_API}/v2/signed-key-requests`, {
        key: convertedKey,
        requestFid: appFid,
        signature,
        deadline,
      })
      .then((response) => response.data.result.signedKeyRequest);

    // save-temp
    saveTempFarsignPrivateKey(keyPair.privateKey);
    saveTempFarsignPubkey(keyPair.publicKey);

    removeFarsignPrivateKey();
    removeFarsignSigner();

    setToken({ token, deepLink: deeplinkUrl });
    setDeepLinkUrl(deeplinkUrl);
    setShowQR(true);

    pollForSigner(token, keyPair);
  }, [pollForSigner]);

  const checkTempSignerValid = useCallback(async () => {
    const tempPrivateKey = getTempFarsignPrivateKey();
    const tempPubkey = getTempFarsignPubkey();
    if (!tempPrivateKey || !tempPubkey) {
      return;
    }

    try {
      const resp = await fetchSignerWithPubkey(tempPubkey);
      const pubKeySigner = resp.data.data.signer;
      // console.log('pubKeySigner', pubKeySigner);
      if (!pubKeySigner) {
        return;
      }

      setPrivateKey(tempPrivateKey);
      const tempSignerKeyRequest = {
        key: `0x${tempPubkey}`,
        userFid: Number(pubKeySigner.fid),
      };
      setSignedKeyRequest(tempSignerKeyRequest);

      // wirte to u3 db
      postProfileBiolink(
        {
          platform: BIOLINK_PLATFORMS.farcaster,
          network: String(BIOLINK_FARCASTER_NETWORK),
          handle: pubKeySigner.fid,
          data: {
            farcasterSignerType: FarcasterSignerType.QR,
            privateKey: tempPrivateKey,
            publicKey: tempPubkey,
            signedKeyRequest: tempSignerKeyRequest,
          },
        },
        didSessionStr
      ).catch((err) => {
        console.error('postProfileBiolink', err);
      });

      removeTempFarsignPrivateKey();
      removeTempFarsignPubkey();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const restoreFromQRcode = useCallback(async () => {
    // check Temp signer valid
    await checkTempSignerValid();

    const signer = getSignedKeyRequest();
    // if NO signer in local storage, try to get from db
    let signedKeyRequest;
    if (!signer && didSessionStr) {
      const farcasterBiolinks = await getProfileBiolink(didSessionStr, {
        platform: BIOLINK_PLATFORMS.farcaster,
        network: String(BIOLINK_FARCASTER_NETWORK),
      });
      // console.log('farcasterBiolinks', farcasterBiolinks);
      if (farcasterBiolinks?.data?.data?.length > 0) {
        const farsignBiolinks = farcasterBiolinks.data.data.filter(
          (item) =>
            item.data?.farcasterSignerType === FarcasterSignerType.QR ||
            (item.data?.farcasterSignerType === undefined &&
              item.data?.signedKeyRequest)
        );
        const farsignBiolinkData = farsignBiolinks[0]
          ?.data as FarcasterBioLinkData;
        if (
          farsignBiolinkData?.privateKey &&
          farsignBiolinkData?.signedKeyRequest
        ) {
          setPrivateKey(farsignBiolinkData.privateKey);
          setSignedKeyRequest(farsignBiolinkData.signedKeyRequest);
          signedKeyRequest = farsignBiolinkData.signedKeyRequest;
          // console.log('get qrcode signer from db: ', signedKeyRequest);
          if (signedKeyRequest.userFid)
            setDefaultFarcaster(signedKeyRequest.userFid);
        }
      }
    } else {
      signedKeyRequest = JSON.parse(signer);
    }
    if (signer) {
      signedKeyRequest = JSON.parse(signer);
    }

    if (signedKeyRequest) {
      setQrSigner({
        SignedKeyRequest: signedKeyRequest,
        isConnected: true,
      });
      setQrFid(signedKeyRequest.userFid);
      getCurrUserInfo(signedKeyRequest.userFid);
    } else {
      setQrCheckStatus('done');
    }
  }, [didSessionStr, checkTempSignerValid]);

  const openFarcasterQR = useCallback(() => {
    stopSign.stop = false;
    initWarpcastAuth();
    setOpenQR(true);
  }, [initWarpcastAuth, setOpenQR]);

  const openQRModal = useMemo(() => {
    return openQR;
  }, [qrSigner.isConnected, openQR]);

  useEffect(() => {
    if (!mounted) return;
    restoreFromQRcode();
  }, [restoreFromQRcode, mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    qrFid,
    qrSigner,
    showQR,
    token,
    setToken,
    setShowQR,
    openQR,
    setOpenQR,
    openFarcasterQR,
    warpcastErr,
    setWarpcastErr,
    restoreFromQRcode,
    openQRModal,
    qrCheckStatus,
    qrUserData,
    deepLinkUrl,
  };
}
