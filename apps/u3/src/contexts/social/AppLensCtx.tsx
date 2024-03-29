import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LensProvider,
  LensConfig,
  development,
  useLogin,
  useLogout,
  useSession,
  production,
  SessionType,
  useUpdateProfileManagers,
  Profile,
  PrimaryPublication,
  useProfiles,
  ProfileId,
} from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { Connector, useAccount, useAccountEffect, useConfig } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useSession as useU3Session } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';
import {
  BIOLINK_LENS_NETWORK,
  BIOLINK_PLATFORMS,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import { LENS_ENV, LENS_ENV_POLYGON_CHAIN_ID } from '../../constants/lens';
import useBioLinkActions from '../../hooks/profile/useBioLinkActions';

interface LensAuthContextValue {
  sessionProfile: Profile;
  isLogin: boolean;
  isLoginPending: boolean;
  lensLogin: () => void;
  lensLogout: () => void;
  openLensLoginModal: boolean;
  setOpenLensLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  openCommentModal: boolean;
  setOpenCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  commentModalData: PrimaryPublication;
  setCommentModalData: React.Dispatch<React.SetStateAction<PrimaryPublication>>;
}

export const LensAuthContext = createContext<LensAuthContextValue>({
  sessionProfile: null,
  isLogin: false,
  isLoginPending: false,
  lensLogin: () => {},
  lensLogout: () => {},
  openLensLoginModal: false,
  setOpenLensLoginModal: () => {},
  openCommentModal: false,
  setOpenCommentModal: () => {},
  commentModalData: null,
  setCommentModalData: () => {},
});
// TODO : 兼容v2登录，为了在登录前获取钱包对应的profileID

let walletProfileId = '';
const getWalletProfileId = (): Promise<ProfileId> => {
  return new Promise((resolve) => {
    let num = 0;
    const intervalId = setInterval(() => {
      if (walletProfileId || num === 30) {
        clearInterval(intervalId);
        resolve(walletProfileId as ProfileId);
      }
      num += 1;
    }, 100);
  });
};

export function AppLensProvider({ children }: PropsWithChildren) {
  const config = useConfig();
  const lensConfig: LensConfig = {
    bindings: wagmiBindings(config),
    environment: LENS_ENV === 'production' ? production : development,
  };
  return (
    <LensProvider config={lensConfig}>
      <LensAuthProvider>{children}</LensAuthProvider>
    </LensProvider>
  );
}

export function LensAuthProvider({ children }: PropsWithChildren) {
  const [openLensLoginModal, setOpenLensLoginModal] = useState(false);
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [commentModalData, setCommentModalData] =
    useState<PrimaryPublication>(null);

  const { execute: login, loading: isLoginPending } = useLogin();
  const { execute: lensLogout } = useLogout();
  const { data: session } = useSession();

  const { openConnectModal } = useConnectModal();

  const sessionProfile = useMemo(() => {
    if (
      !!session &&
      session.type === SessionType.WithProfile &&
      session.authenticated
    ) {
      return session.profile;
    }
    return null;
  }, [session]);

  const isLogin = useMemo(() => !!sessionProfile, [sessionProfile]);

  const { execute: updateProfileManagers } = useUpdateProfileManagers();

  const updatedDispatcherFirst = useRef(false);
  useEffect(() => {
    if (updatedDispatcherFirst.current) return;
    if (!isLogin) return;
    if (sessionProfile?.signless) return;
    updateProfileManagers({ approveSignless: true }).finally(() => {
      updatedDispatcherFirst.current = true;
    });
  }, [sessionProfile, updateProfileManagers]);

  // TODO : 兼容v2登录，为了在登录前获取钱包对应的profileID
  const [walletAddress, setWalletAddress] = useState<string>(null);
  const profilesWhere = {};
  if (walletAddress) {
    Object.assign(profilesWhere, { ownedBy: [walletAddress] });
  }
  const { data: profiles } = useProfiles({
    where: profilesWhere,
  });
  const firstProfile = profiles?.[0] || { id: '' };
  const { id: firstProfileId } = firstProfile;
  useEffect(() => {
    walletProfileId = firstProfileId;
  }, [firstProfileId]);

  // const { execute: fetchProfile } = useLazyProfile();
  const lensLoginStartRef = useRef(false);
  const lensLoginAdpater = async (
    connector: Connector,
    address: `0x${string}`
  ) => {
    const chainId = await connector.getChainId();
    if (chainId !== LENS_ENV_POLYGON_CHAIN_ID) {
      if (connector?.switchChain) {
        await connector?.switchChain({ chainId: LENS_ENV_POLYGON_CHAIN_ID });
      }
    }
    walletProfileId = '';
    setWalletAddress(address);
    const profileId = await getWalletProfileId();
    if (!profileId) {
      console.error('lens login error: profileId is null');
      return;
    }

    await login({ address, profileId });
  };

  const { connector: activeConnector, isConnected, address } = useAccount();

  useAccountEffect({
    async onConnect(data) {
      if (lensLoginStartRef.current) {
        await lensLoginAdpater(data.connector, address);
        lensLoginStartRef.current = false;
      }
    },
  });

  const lensLogin = useCallback(async () => {
    if (isConnected) {
      await lensLoginAdpater(activeConnector, address);
    } else if (openConnectModal) {
      lensLoginStartRef.current = true;
      openConnectModal();
    }
  }, [isConnected, openConnectModal, activeConnector, lensLoginAdpater]);

  // 每次lens登录成功后，更新lens biolink
  const u3Session = useU3Session();
  const { profile } = useProfileState();
  const { upsertBioLink } = useBioLinkActions();
  useEffect(() => {
    if (
      !!u3Session?.id &&
      !!profile?.id &&
      !isLoginPending &&
      !!sessionProfile
    ) {
      upsertBioLink({
        did: u3Session.id,
        bioLink: {
          profileID: profile.id,
          platform: BIOLINK_PLATFORMS.lens,
          network: BIOLINK_LENS_NETWORK,
          handle: lensHandleToBioLinkHandle(sessionProfile.handle.fullHandle),
          data: JSON.stringify(sessionProfile),
        },
      });
    }
  }, [u3Session, profile, isLoginPending, sessionProfile]);

  return (
    <LensAuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        sessionProfile,
        isLogin,
        isLoginPending,
        lensLogin,
        lensLogout,
        openLensLoginModal,
        setOpenLensLoginModal,
        openCommentModal,
        setOpenCommentModal,
        commentModalData,
        setCommentModalData,
      }}
    >
      {children}
    </LensAuthContext.Provider>
  );
}

export function useLensCtx() {
  const context = useContext(LensAuthContext);
  if (!context) {
    throw Error(
      'useLensCtx can only be used within the LensAuthProvider component'
    );
  }
  return context;
}
