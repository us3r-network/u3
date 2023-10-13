/* eslint-disable import/no-cycle */
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
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
  production,
  useUpdateDispatcherConfig,
} from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { Connector, useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { isMobile } from 'react-device-detect';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';
import {
  BIOLINK_LENS_NETWORK,
  BIOLINK_PLATFORMS,
  lensHandleToBioLinkHandle,
} from '../utils/profile/biolink';
import { LENS_ENV, LENS_ENV_POLYGON_CHAIN_ID } from '../constants/lens';

import LensLoginModal from '../components/social/lens/LensLoginModal';
import LensCommentPostModal from '../components/social/lens/LensCommentPostModal';

import { LensPost, LensComment } from '../api/lens';
import useBioLinkActions from '../hooks/useBioLinkActions';

type CommentModalData = LensPost | LensComment | null;
interface LensAuthContextValue {
  isLogin: boolean;
  isLoginPending: boolean;
  lensLogin: () => void;
  lensLogout: () => void;
  openLensLoginModal: boolean;
  setOpenLensLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  openCommentModal: boolean;
  setOpenCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
  commentModalData: CommentModalData;
  setCommentModalData: React.Dispatch<React.SetStateAction<CommentModalData>>;
}

export const LensAuthContext = createContext<LensAuthContextValue>({
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

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: LENS_ENV === 'production' ? production : development,
};

export function AppLensProvider({ children }: PropsWithChildren) {
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
    useState<CommentModalData>(null);

  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { execute: lensLogout } = useWalletLogout();
  const { data: wallet } = useActiveProfile();

  const { openConnectModal } = useConnectModal();

  const { execute: updateDispatcher } = useUpdateDispatcherConfig({
    profile: wallet,
  });

  const updatedDispatcherFirst = useRef(false);
  useEffect(() => {
    if (updatedDispatcherFirst.current) return;
    if (!wallet) return;
    if (!wallet?.dispatcher) {
      updateDispatcher({ enabled: true }).finally(() => {
        updatedDispatcherFirst.current = true;
      });
    }
  }, [wallet, updateDispatcher]);

  const lensLoginStartRef = useRef(false);
  const lensLoginAdpater = async (connector: Connector) => {
    const chainId = await connector.getChainId();
    if (chainId !== LENS_ENV_POLYGON_CHAIN_ID) {
      if (connector?.switchChain) {
        await connector?.switchChain(LENS_ENV_POLYGON_CHAIN_ID);
      }
    }
    const walletClient = await connector.getWalletClient();
    const { address } = walletClient.account;
    await login({ address });
  };

  const { connector: activeConnector, isConnected } = useAccount({
    async onConnect({ connector }) {
      if (lensLoginStartRef.current) {
        await lensLoginAdpater(connector);
        lensLoginStartRef.current = false;
      }
    },
  });

  const lensLogin = useCallback(async () => {
    if (isConnected) {
      await lensLoginAdpater(activeConnector);
    } else if (openConnectModal) {
      lensLoginStartRef.current = true;
      openConnectModal();
    }
  }, [isConnected, openConnectModal, activeConnector, lensLoginAdpater]);

  const isLogin = useMemo(() => !!wallet, [wallet]);

  // 每次lens登录成功后，更新lens biolink
  const session = useSession();
  const { profile } = useProfileState();
  const { upsertBioLink } = useBioLinkActions();
  useEffect(() => {
    if (!!session?.id && !!profile?.id && !isLoginPending && !!wallet) {
      upsertBioLink({
        did: session.id,
        bioLink: {
          profileID: profile.id,
          platform: BIOLINK_PLATFORMS.lens,
          network: BIOLINK_LENS_NETWORK,
          handle: lensHandleToBioLinkHandle(wallet.handle),
          data: JSON.stringify(wallet),
        },
      });
    }
  }, [session, profile, isLoginPending, wallet]);

  return (
    <LensAuthContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
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
      <LensLoginModal
        open={openLensLoginModal}
        closeModal={() => setOpenLensLoginModal(false)}
      />
      <LensCommentPostModal
        open={openCommentModal}
        closeModal={() => setOpenCommentModal(false)}
      />
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
