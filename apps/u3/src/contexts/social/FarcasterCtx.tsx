/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import { NobleEd25519Signer, UserDataType } from '@farcaster/hub-web';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';

import FarcasterSignerSelectModal from 'src/components/social/farcaster/FarcasterSignerSelectModal';
import FarcasterVerifyModal from 'src/components/social/farcaster/FarcasterVerifyModal';
import useFarcasterWallet from 'src/hooks/social/farcaster/useFarcasterWallet';
import useFarcasterQR from 'src/hooks/social/farcaster/useFarcasterQR';
import useFarcasterTrendChannel from 'src/hooks/social/farcaster/useFarcasterTrendChannel';
import useFarcasterFollowData from 'src/hooks/social/farcaster/useFarcasterFollowData';
import useFarcasterChannel from 'src/hooks/social/farcaster/useFarcasterChannel';

import { getPrivateKey } from '../../utils/social/farcaster/farsign-utils';
import FarcasterQRModal from '../../components/social/farcaster/FarcasterQRModal';
import useBioLinkActions from '../../hooks/profile/useBioLinkActions';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_PLATFORMS,
  farcasterHandleToBioLinkHandle,
} from '../../utils/profile/biolink';

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
  parent_url: string;
  image: string;
  channel_id: string;
  count: string;
};
export interface FarcasterContextData {
  currFid: number | undefined;
  setCurrFid: React.Dispatch<React.SetStateAction<number | undefined>>;
  currUserInfo:
    | {
        [key: string]: { type: number; value: string }[];
      }
    | undefined;
  isConnected: boolean;
  token: Token;
  encryptedSigner: NobleEd25519Signer | undefined;
  setSigner: React.Dispatch<React.SetStateAction<Signer>>;
  openFarcasterQR: () => void;
  farcasterUserData: FarcasterUserData;
  setFarcasterUserData: React.Dispatch<React.SetStateAction<FarcasterUserData>>;
  channels: FarcasterChannel[];
  following: string[];
  setFollowing: React.Dispatch<React.SetStateAction<string[]>>;
  joinChannel: (parent_url: string) => Promise<void>;
  unPinChannel: (parent_url: string) => Promise<void>;
  userChannels: { parent_url: string }[];
  getUserChannels: () => Promise<void>;
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
  const navigate = useNavigate();
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

  const [encryptedSigner, setEncryptedSigner] = useState<NobleEd25519Signer>();
  const [currUserInfo, setCurrUserInfo] = useState<{
    [key: string]: { type: number; value: string }[];
  }>();
  const [currFid, setCurrFid] = useState<number>();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [signerSelectModalOpen, setSignerSelectModalOpen] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const { farcasterFollowData } = useFarcasterFollowData({
    fid: currFid,
  });
  useEffect(() => {
    setFollowing(farcasterFollowData?.followingData || []);
  }, [farcasterFollowData]);
  const { userChannels, getUserChannels, joinChannel, unPinChannel } =
    useFarcasterChannel({
      currFid,
    });

  const { walletCheckStatus, walletUserData, walletFid, walletSigner } =
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
    qrCheckStatus,
    qrUserData,
  } = useFarcasterQR();

  const { channels } = useFarcasterTrendChannel();

  const openFarcasterVerifyModal = useCallback(() => {
    if (signer.isConnected) return;
    setVerifyModalOpen(true);
  }, [signer.isConnected]);

  const useQRSigner = useCallback(() => {
    const privateKey = getPrivateKey();
    if (!privateKey) {
      console.error('useQRSigner , no private key');
      return;
    }
    setCurrFid(qrFid);
    setSigner(qrSigner);
    const data = {
      [qrFid]: qrUserData,
    };
    setCurrUserInfo(data);
    setEncryptedSigner(new NobleEd25519Signer(Buffer.from(privateKey, 'hex')));
    setSignerSelectModalOpen(false);
  }, [qrFid, qrSigner, qrUserData]);

  const useWalletSigner = useCallback(() => {
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
    const data = {
      [walletFid]: walletUserData,
    };
    setCurrUserInfo(data);
    setEncryptedSigner(walletSigner);
    setSignerSelectModalOpen(false);
  }, [walletFid, walletSigner, walletUserData]);

  useEffect(() => {
    console.log({ walletCheckStatus, qrCheckStatus });
    if (!walletCheckStatus || !qrCheckStatus) return;
    if (walletCheckStatus === 'valid' && qrCheckStatus === 'valid') {
      setSignerSelectModalOpen(true);
      return;
    }
    if (walletCheckStatus === 'valid') {
      useWalletSigner();
      return;
    }
    if (qrCheckStatus === 'valid') {
      useQRSigner();
      return;
    }
    console.log('no valid signer');
  }, [walletCheckStatus, qrCheckStatus, useQRSigner, useWalletSigner]);

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

  return (
    <FarcasterContext.Provider
      // TODO: fix this
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currFid,
        setCurrFid,
        setSigner,
        currUserInfo,
        isConnected: signer.isConnected,
        token,
        encryptedSigner,
        openFarcasterQR: openFarcasterVerifyModal,
        farcasterUserData,
        setFarcasterUserData,
        channels,
        following,
        setFollowing,
        userChannels,
        joinChannel,
        unPinChannel,
        getUserChannels,
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
      <FarcasterVerifyModal
        open={verifyModalOpen}
        closeAction={() => {
          setVerifyModalOpen(false);
        }}
        addCountAction={() => {
          setVerifyModalOpen(false);
          openFarcasterQR();
        }}
        registerAction={() => {
          setVerifyModalOpen(false);
          navigate('/farcaster/signup');
          // setOpenQR(true);
        }}
      />
      <FarcasterSignerSelectModal
        open={signerSelectModalOpen}
        closeModal={() => {
          setSignerSelectModalOpen(false);
        }}
        afterCloseAction={() => {}}
        qrUserData={qrUserData}
        walletUserData={walletUserData}
        confirmAction={(type: 'qr' | 'wallet') => {
          if (type === 'qr') {
            useQRSigner();
            return;
          }
          if (type === 'wallet') {
            useWalletSigner();
            return;
          }
          console.log('confirmAction', { type });
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
