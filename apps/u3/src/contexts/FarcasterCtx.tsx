/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import { NobleEd25519Signer } from '@farcaster/hub-web';
import { createPublicClient, http } from 'viem';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import { goerli } from 'viem/chains';
import { toast } from 'react-toastify';

import { WARPCAST_API } from '../constants/farcaster';
import {
  generateKeyPair,
  getCurrFid,
  getPrivateKey,
  getSignedKeyRequest,
  setPrivateKey,
  setSignedKeyRequest,
} from '../utils/farsign-utils';
import {
  getFarcasterChannelTrends,
  getFarcasterSignature,
  getFarcasterUserInfo,
} from '../api/farcaster';
import FarcasterQRModal from '../components/social/farcaster/FarcasterQRModal';
import FarcasterIframeModal from '../components/social/farcaster/FarcasterIframeModal';
import FarcasterChannelData from '../constants/warpcast.json';

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

export type Token = {
  token: string;
  deepLink: string;
};

export type Keypair = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
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

export type FarcasterUserData = {
  [key: string]: { type: number; value: string }[];
};

export type FarcasterChannel = {
  name?: string;
  channel_description?: string;
  parent_url: string;
  image: string;
  channel_id: string;
  count: string;
};
export interface FarcasterContextData {
  currFid: number | undefined;
  currUserInfo:
    | {
        [key: string]: { type: number; value: string }[];
      }
    | undefined;
  isConnected: boolean;
  token: Token;
  encryptedSigner: NobleEd25519Signer | undefined;
  openFarcasterQR: () => void;
  farcasterUserData: FarcasterUserData;
  setFarcasterUserData: React.Dispatch<React.SetStateAction<FarcasterUserData>>;
  setIframeUrl: React.Dispatch<React.SetStateAction<string>>;
  channels: FarcasterChannel[];
}

const FarcasterContext = createContext<FarcasterContextData | null>(null);

const stopSign = {
  stop: false,
};

export default function FarcasterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [farcasterUserData, setFarcasterUserData] = useState<FarcasterUserData>(
    {}
  );
  const [iframeUrl, setIframeUrl] = useState('');

  const [signer, setSigner] = useState<Signer>({
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
  const [showQR, setShowQR] = useState(false);
  const [token, setToken] = useState<Token>({
    token: '',
    deepLink: '',
  });
  const [warpcastErr, setWarpcastErr] = useState<string>('');

  const [currUserInfo, setCurrUserInfo] = useState<{
    [key: string]: { type: number; value: string }[];
  }>();
  const [currFid, setCurrFid] = useState<number>();
  const [openQR, setOpenQR] = useState(false);

  const [trendChannel, setTrendChannel] = useState<
    {
      parent_url: string;
      count: string;
    }[]
  >([]);
  const loadTrendChannel = async () => {
    const resp = await getFarcasterChannelTrends();
    if (resp.data.code !== 0) {
      console.error(resp.data.msg);
      return;
    }
    setTrendChannel(resp.data.data);
  };
  useEffect(() => {
    loadTrendChannel();
  }, []);

  const channels = useMemo(() => {
    return FarcasterChannelData.map((c) => {
      const trend = trendChannel.find((t) => t.parent_url === c.parent_url);
      if (!trend) return null;
      return {
        ...trend,
        ...c,
      };
    })
      .filter((c) => c !== null)
      .sort((a, b) => {
        return Number(b.count) - Number(a.count);
      });
  }, [trendChannel]);

  const openQRModal = useMemo(() => {
    if (signer.isConnected) {
      return false;
    }
    return openQR;
  }, [signer.isConnected, openQR]);

  const getCurrUserInfo = async () => {
    const cFid = getCurrFid();
    const resp = await getFarcasterUserInfo([cFid]);
    if (resp.data.code === 0) {
      const data: {
        [key: string]: { type: number; value: string }[];
      } = {};
      data[cFid] = resp.data.data;
      setCurrUserInfo(data);
      setCurrFid(cFid);
    }
  };

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

      const { signedKeyRequest } = await axios
        .get(`${WARPCAST_API}/v2/signed-key-request`, {
          params: {
            token,
          },
        })
        .then((response) => response.data.result);

      if (signedKeyRequest.state === 'completed') {
        setSignedKeyRequest(signedKeyRequest);

        setSigner({
          SignedKeyRequest: signedKeyRequest,
          isConnected: true,
        });
        signerSuccess = true;
        break;
      }
    }

    if (signerSuccess) {
      toast.success('Farcaster connected');
    } else if (!stopped) {
      toast.error('Farcaster connect failed');
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

  const openFarcasterQR = () => {
    stopSign.stop = false;
    initWarpcastAuth();
    setOpenQR(true);
  };

  const encryptedSigner = useMemo(() => {
    if (!signer.isConnected) return undefined;
    const privateKey = getPrivateKey();

    return new NobleEd25519Signer(Buffer.from(privateKey, 'hex'));
  }, [signer.isConnected]);

  useEffect(() => {
    if (signer.isConnected) {
      getCurrUserInfo();
    }
  }, [signer.isConnected]);

  useEffect(() => {
    const signer = getSignedKeyRequest();

    if (signer != null) {
      setToken({
        token: 'already connected',
        deepLink: 'already connected',
      });
      setSigner({
        SignedKeyRequest: JSON.parse(signer),
        isConnected: true,
      });
    }
  }, []);

  return (
    <FarcasterContext.Provider
      // TODO: fix this
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currFid,
        currUserInfo,
        isConnected: signer.isConnected,
        token,
        encryptedSigner,
        openFarcasterQR,
        farcasterUserData,
        setFarcasterUserData,
        setIframeUrl,
        channels,
      }}
    >
      {children}
      <FarcasterQRModal
        warpcastErr={warpcastErr}
        showQR={showQR}
        open={openQRModal}
        closeModal={() => {
          setWarpcastErr('');
          setOpenQR(false);
        }}
        token={token}
        afterCloseAction={() => {
          setShowQR(false);
          stopSign.stop = true;
        }}
      />
      <FarcasterIframeModal
        iframeUrl={iframeUrl}
        open={!!iframeUrl}
        closeModal={() => {}}
        afterCloseAction={() => {
          setIframeUrl('');
        }}
      />
    </FarcasterContext.Provider>
  );
}

export function useFarcasterCtx(): FarcasterContextData {
  const context = useContext(FarcasterContext);
  if (!context) {
    throw new Error('Missing context');
  }
  return {
    ...context,
  };
}
