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
  Post,
  Comment,
} from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { LENS_ENV } from '../constants/lens';

import LensLoginModal from '../components/social/lens/LensLoginModal';
import LensCommentPostModal from '../components/social/lens/LensCommentPostModal';

import { LensPublication } from '../api/lens';

type CommentModalData = LensPublication | Post | Comment | null;
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

export enum LensPubSubTopic {
  LOGIN_WITH_RAINBOWKIT = 'lens-login-with-rainbowkit',
}

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
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

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

  useAccount({
    async onConnect({ connector, isReconnected }) {
      if (isReconnected) {
        return;
      }
      const walletClient = await connector.getWalletClient();
      const { address } = walletClient.account;

      await login({
        address,
      });
    },
  });

  const lensLoginOpenRainbowkit = useCallback(() => {
    if (openConnectModal) openConnectModal();
  }, [openConnectModal]);

  const lensLogin = useCallback(async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    PubSub.publish(LensPubSubTopic.LOGIN_WITH_RAINBOWKIT);
  }, [isConnected, disconnectAsync]);

  useEffect(() => {
    const loginToken = PubSub.subscribe(
      LensPubSubTopic.LOGIN_WITH_RAINBOWKIT,
      () => lensLoginOpenRainbowkit()
    );
    return () => {
      PubSub.unsubscribe(loginToken);
    };
  }, [lensLoginOpenRainbowkit]);

  const isLogin = useMemo(() => !!wallet, [wallet]);

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
