/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import { NobleEd25519Signer, UserDataType } from '@farcaster/hub-web';
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
import { goerli } from 'viem/chains';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';

import useFarcasterWallet from 'src/hooks/farcaster/useFarcasterWallet';
import useFarcasterQR from 'src/hooks/farcaster/useFarcasterQR';
import useFarcasterTrendChannel from 'src/hooks/farcaster/useFarcasterTrendChannel';

import { getPrivateKey } from '../utils/farsign-utils';
import { getFarcasterUserInfo } from '../api/farcaster';
import FarcasterQRModal from '../components/social/farcaster/FarcasterQRModal';
import useBioLinkActions from '../hooks/profile/useBioLinkActions';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_PLATFORMS,
  farcasterHandleToBioLinkHandle,
} from '../utils/profile/biolink';

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

  const [currUserInfo, setCurrUserInfo] = useState<{
    [key: string]: { type: number; value: string }[];
  }>();
  const [currFid, setCurrFid] = useState<number>();

  const { walletCheckStatus, walletFid, walletSigner, hasStorage } =
    useFarcasterWallet();
  const {
    qrFid,
    qrSigner,
    openFarcasterQR,
    openQRModal,
    setOpenQR,
    showQR,
    setShowQR,
    token,
    warpcastErr,
    setWarpcastErr,
  } = useFarcasterQR();

  const { channels } = useFarcasterTrendChannel();

  const getCurrUserInfo = useCallback(async () => {
    console.log('getCurrentUserInfo', { currFid });
    if (!currFid) return;
    const resp = await getFarcasterUserInfo([currFid]);
    if (resp.data.code === 0) {
      const data: {
        [key: string]: { type: number; value: string }[];
      } = {};
      data[currFid] = resp.data.data;
      setCurrUserInfo(data);
    }
  }, [currFid]);

  useEffect(() => {
    if (signer.isConnected) {
      getCurrUserInfo();
    }
  }, [signer.isConnected, getCurrUserInfo]);

  const encryptedSigner = useMemo(() => {
    if (!walletCheckStatus) return undefined;
    if (walletCheckStatus === 'idle') {
      const privateKey = getPrivateKey();
      if (!privateKey) return undefined;
      return new NobleEd25519Signer(Buffer.from(privateKey, 'hex'));
    }

    if (walletCheckStatus !== 'done') return undefined;
    if (!signer.isConnected) return undefined;
    if (walletFid && walletSigner && hasStorage) {
      return walletSigner;
    }

    const privateKey = getPrivateKey();
    if (!privateKey) return undefined;

    return new NobleEd25519Signer(Buffer.from(privateKey, 'hex'));
  }, [
    signer.isConnected,
    walletCheckStatus,
    walletFid,
    walletSigner,
    hasStorage,
  ]);

  useEffect(() => {
    // console.log('walletCheckStatus', { walletCheckStatus });
    if (!walletCheckStatus) return;
    if (walletCheckStatus === 'idle') {
      setCurrFid(qrFid);
      setSigner(qrSigner);
      return;
    }
    if (walletCheckStatus !== 'done') return;
    if (walletFid && walletSigner && hasStorage) {
      setCurrFid(walletFid);
      setSigner({
        SignedKeyRequest: {
          deeplinkUrl: '',
          key: '',
          requestFid: 0,
          state: 'completed',
          token: '',
          userFid: walletFid,
        },
        isConnected: true,
      });
      return;
    }
    console.log('use qr check', { walletFid, walletSigner, hasStorage });
    setCurrFid(qrFid);
    setSigner(qrSigner);
  }, [walletFid, hasStorage, walletSigner, walletCheckStatus, qrFid, qrSigner]);

  // 每次farcaster登录成功后，更新farcaster biolink
  const session = useSession();
  const { profile } = useProfileState();
  const { upsertBioLink } = useBioLinkActions();
  useEffect(() => {
    const findUserInfo = currUserInfo?.[currFid]?.find(
      (item) => item.type === UserDataType.USERNAME
    );
    const handle = findUserInfo?.value || '';
    if (!!session?.id && !!profile?.id && signer?.isConnected && !!handle) {
      upsertBioLink({
        did: session.id,
        bioLink: {
          profileID: profile.id,
          platform: BIOLINK_PLATFORMS.farcaster,
          network: String(BIOLINK_FARCASTER_NETWORK),
          handle: farcasterHandleToBioLinkHandle(handle),
          data: JSON.stringify({ fid: currFid, ...findUserInfo }),
        },
      });
    }
  }, [session, profile, signer, currFid, currUserInfo]);

  // console.log({ qrFid, qrSigner });
  // console.log({ walletFid, walletSigner });

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
