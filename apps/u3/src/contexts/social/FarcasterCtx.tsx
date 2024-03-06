/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-shadow */
import { NobleEd25519Signer, UserDataType } from '@farcaster/hub-web';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';

import useLogin from 'src/hooks/shared/useLogin';
import FarcasterSignerSelectModal from 'src/components/social/farcaster/FarcasterSignerSelectModal';
import useFarcasterWallet from 'src/hooks/social/farcaster/useFarcasterWallet';
import useFarcasterQR from 'src/hooks/social/farcaster/useFarcasterQR';
import useFarcasterTrendChannel from 'src/hooks/social/farcaster/useFarcasterTrendChannel';
import useFarcasterFollowData from 'src/hooks/social/farcaster/useFarcasterFollowData';
import useFarcasterChannel, {
  FarcasterChannel,
} from 'src/hooks/social/farcaster/useFarcasterChannel';

import {
  getDefaultFarcaster,
  setDefaultFarcaster,
} from 'src/utils/social/farcaster/farcaster-default';

import { getPrivateKey } from '../../utils/social/farcaster/farsign-utils';
import FarcasterQRModal from '../../components/social/farcaster/FarcasterQRModal';
import useBioLinkActions from '../../hooks/profile/useBioLinkActions';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_PLATFORMS,
  farcasterHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import {
  UserData,
  userDataObjFromArr,
} from '@/utils/social/farcaster/user-data';
import usePinupHashes from '@/hooks/social/farcaster/usePinupHashes';
import AddPostModal from '@/components/social/AddPostModal';
import QuickSearchModal, {
  QuickSearchModalName,
} from '@/components/social/QuickSearchModal';
import ClaimNotice from '@/components/social/farcaster/ClaimNotice';
import useFarcasterClaim from '@/hooks/social/farcaster/useFarcasterClaim';

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

export interface FarcasterContextData {
  currFid: number | undefined;
  setCurrFid: React.Dispatch<React.SetStateAction<number | undefined>>;
  currUserInfoObj: UserData | undefined;
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
  following: string[];
  setFollowing: React.Dispatch<React.SetStateAction<string[]>>;
  joinChannel: (parent_url: string) => Promise<void>;
  unPinChannel: (parent_url: string) => Promise<void>;
  userChannels: { parent_url: string }[];
  getUserChannels: () => Promise<void>;
  browsingChannel: { parent_url: string } | undefined;
  setBrowsingChannel: React.Dispatch<
    React.SetStateAction<{ parent_url: string } | undefined>
  >;
  setSignerSelectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pinupHashes: Set<string>;
  updatePinupHashes: () => Promise<void>;
  trendChannels: FarcasterChannel[];
  trendChannelsLoading: boolean;
  farcasterChannels: FarcasterChannel[];
  farcasterChannelsLoading: boolean;
  getChannelFromId: (id: string) => FarcasterChannel | null;
  getChannelFromUrl: (url: string) => FarcasterChannel | null;
  openPostModal: boolean;
  setOpenPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenModalName: React.Dispatch<React.SetStateAction<string>>;
  setDefaultPostChannelId: React.Dispatch<React.SetStateAction<string>>;
  claimStatus: {
    statusCode: number;
    amount: number;
    msg?: string;
  };
  setClaimStatus: React.Dispatch<
    React.SetStateAction<{
      statusCode: number;
      amount: number;
      msg?: string;
    }>
  >;
}

const FarcasterContext = createContext<FarcasterContextData | null>(null);

export default function FarcasterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [farcasterUserData, setFarcasterUserData] = useState<FarcasterUserData>(
    {}
  );
  const { isLogin, login } = useLogin();
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
  const [selectType, setSelectType] = useState('');
  const [currFid, setCurrFid] = useState<number>();
  const [signerSelectModalOpen, setSignerSelectModalOpen] = useState(false);
  const [following, setFollowing] = useState<string[]>([]);
  const { farcasterFollowData } = useFarcasterFollowData({
    fid: currFid,
  });
  const { claimStatus, setClaimStatus } = useFarcasterClaim({ currFid });
  useEffect(() => {
    setFollowing(farcasterFollowData?.followingData || []);
  }, [farcasterFollowData]);
  const {
    userChannels,
    getUserChannels,
    joinChannel,
    unPinChannel,
    farcasterChannels,
    farcasterChannelsLoading,
    getChannelFromId,
    getChannelFromUrl,
  } = useFarcasterChannel({
    currFid,
  });
  const [browsingChannel, setBrowsingChannel] = useState<{
    parent_url: string;
  }>();

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
    deepLinkUrl,
  } = useFarcasterQR();
  const [openModalName, setOpenModalName] = useState('');
  const [openPostModal, setOpenPostModal] = useState(false);
  const [defaultPostChannelId, setDefaultPostChannelId] = useState('home');
  const { pinupHashes, updatePinupHashes } = usePinupHashes();
  const { channels: trendChannels, loading: trendChannelsLoading } =
    useFarcasterTrendChannel(farcasterChannels);

  const openFarcasterSelectModal = useCallback(() => {
    setSignerSelectModalOpen(true);
  }, []);

  const resetSigner = useCallback(() => {
    setCurrFid(undefined);
    setSigner({
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
    setCurrUserInfo(undefined);
    setEncryptedSigner(undefined);
  }, []);
  const useQRSigner = useCallback(() => {
    const privateKey = getPrivateKey();
    if (!privateKey) {
      console.error('useQRSigner , no private key');
      return;
    }

    if (qrFid) setDefaultFarcaster(`${qrFid}`);
    setCurrFid(qrFid);
    setSigner(qrSigner);
    const data = {
      [qrFid]: qrUserData,
    };
    setCurrUserInfo(data);
    setEncryptedSigner(new NobleEd25519Signer(Buffer.from(privateKey, 'hex')));
  }, [qrFid, qrSigner, qrUserData]);

  const useWalletSigner = useCallback(() => {
    if (walletFid) setDefaultFarcaster(`${walletFid}`);
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
  }, [walletFid, walletSigner, walletUserData]);

  useEffect(() => {
    if (!walletCheckStatus && !qrCheckStatus) {
      return;
    }
    const defaultFid = getDefaultFarcaster();
    if (!defaultFid) {
      return;
    }
    if (defaultFid === `${qrFid}`) {
      useQRSigner();
      return;
    }
    if (defaultFid === `${walletFid}`) {
      useWalletSigner();
    }
  }, [walletCheckStatus, qrCheckStatus, isLogin]);

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

  useHotkeys(
    'meta+p,ctrl+p',
    (e) => {
      e.preventDefault();
      if (!isLogin) {
        login();
        return;
      }
      setOpenPostModal(true);
    },
    { preventDefault: true },
    [isLogin]
  );

  useHotkeys(
    'meta+k,ctrl+k',
    (e) => {
      e.preventDefault();
      setOpenModalName(QuickSearchModalName);
    },
    { preventDefault: true },
    []
  );

  const currUserInfoObj = useMemo(() => {
    if (!currUserInfo || !currUserInfo[currFid]) return undefined;
    const data = userDataObjFromArr(
      currUserInfo[currFid].map((item) => ({
        fid: `${currFid}`,
        ...item,
      }))
    );
    return data[currFid];
  }, [currFid, currUserInfo]);

  return (
    <FarcasterContext.Provider
      // TODO: fix this
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currFid,
        setCurrFid,
        setSigner,
        currUserInfo,
        currUserInfoObj,
        isConnected: signer.isConnected,
        token,
        encryptedSigner,
        openFarcasterQR: openFarcasterSelectModal,
        farcasterUserData,
        setFarcasterUserData,
        following,
        setFollowing,
        userChannels,
        joinChannel,
        unPinChannel,
        getUserChannels,
        browsingChannel,
        setBrowsingChannel,
        setSignerSelectModalOpen,
        updatePinupHashes,
        pinupHashes,
        trendChannels,
        trendChannelsLoading,
        farcasterChannels,
        farcasterChannelsLoading,
        getChannelFromId,
        getChannelFromUrl,
        openPostModal,
        setOpenPostModal,
        setOpenModalName,
        setDefaultPostChannelId,
        claimStatus,
        setClaimStatus,
      }}
    >
      {children}
      <FarcasterQRModal
        warpcastErr={warpcastErr}
        showQR={showQR}
        deepLinkUrl={deepLinkUrl}
        open={openQRModal}
        closeModal={() => {
          setWarpcastErr('');
          setOpenQR(false);
        }}
        token={token}
        afterCloseAction={() => {
          setShowQR(false);
        }}
      />

      <FarcasterSignerSelectModal
        qrFid={qrFid}
        walletFid={walletFid}
        walletCheckStatus={walletCheckStatus}
        qrCheckStatus={qrCheckStatus}
        open={signerSelectModalOpen}
        closeModal={() => {
          setSignerSelectModalOpen(false);
        }}
        afterCloseAction={() => {}}
        qrUserData={qrUserData}
        walletUserData={walletUserData}
        resetAction={() => {
          resetSigner();
        }}
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
        addAccountAction={() => {
          setSignerSelectModalOpen(false);
          openFarcasterQR();
        }}
        registerAction={() => {
          setSignerSelectModalOpen(false);
          navigate('/farcaster/signupv2');
        }}
        selectType={selectType}
        setSelectType={(type: string) => {
          setSelectType(type);
        }}
      />

      <AddPostModal
        open={openPostModal}
        defaultChannelId={defaultPostChannelId}
        closeModal={() => {
          setOpenPostModal(false);
        }}
      />
      {openModalName === QuickSearchModalName && (
        <QuickSearchModal
          openModalName={openModalName}
          closeModal={() => {
            setOpenModalName('');
          }}
        />
      )}
      <ClaimNotice />
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
