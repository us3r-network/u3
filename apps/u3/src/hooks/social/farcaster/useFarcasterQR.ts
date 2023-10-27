/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';

import {
  generateKeyPair,
  getSignedKeyRequest,
  setPrivateKey,
  setSignedKeyRequest,
} from 'src/utils/social/farcaster/farsign-utils';
import { WARPCAST_API } from 'src/constants/farcaster';
import { getFarcasterSignature } from 'src/services/social/api/farcaster';

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

export default function useFarcasterQR() {
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
  const pollForSigner = useCallback(async (token: string) => {
    let tries = 0;

    let signerSuccess = false;
    let stopped = false;

    while (tries < 40) {
      if (stopSign.stop) {
        stopped = true;
        break;
      }
      tries += 1;
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 3000));

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
        restoreFromQRcode();
        signerSuccess = true;
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

    setPrivateKey(keyPair.privateKey);
    pollForSigner(token);
    setToken({ token, deepLink: deeplinkUrl });
    if (isMobile) {
      window.open(deeplinkUrl, '_blank');
    } else {
      setShowQR(true);
    }
  }, [pollForSigner]);

  const restoreFromQRcode = useCallback(() => {
    const signer = getSignedKeyRequest();

    if (signer != null) {
      const signedKeyRequest = JSON.parse(signer);
      setToken({
        token: 'already connected',
        deepLink: 'already connected',
      });
      setQrSigner({
        SignedKeyRequest: signedKeyRequest,
        isConnected: true,
      });
      setQrFid(signedKeyRequest.userFid);
    }
  }, []);

  const openFarcasterQR = useCallback(() => {
    if (qrSigner.isConnected) {
      return;
    }
    stopSign.stop = false;
    initWarpcastAuth();
    setOpenQR(true);
  }, [initWarpcastAuth, qrSigner.isConnected]);

  const openQRModal = useMemo(() => {
    if (qrSigner.isConnected) {
      return false;
    }
    return openQR;
  }, [qrSigner.isConnected, openQR]);

  useEffect(() => {
    restoreFromQRcode();
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
  };
}
