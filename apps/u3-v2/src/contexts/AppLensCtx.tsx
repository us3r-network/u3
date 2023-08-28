import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  LensProvider,
  LensConfig,
  development,
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
  production,
  useUpdateDispatcherConfig,
  ProfileOwnedByMe,
} from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LENS_ENV } from '../constants/lens'
import LensLoginModal from '../components/lens/LensLoginModal'

interface LensAuthContextValue {
  isLogin: boolean
  isLoginPending: boolean
  lensLogin: () => void
  lensLogout: () => void
  openLensLoginModal: boolean
  setOpenLensLoginModal: (open: boolean) => void
}

export const LensAuthContext = createContext<LensAuthContextValue>({
  isLogin: false,
  isLoginPending: false,
  lensLogin: () => {},
  lensLogout: () => {},
  openLensLoginModal: false,
  setOpenLensLoginModal: () => {},
})

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: LENS_ENV === 'production' ? production : development,
}

export function AppLensProvider({ children }: PropsWithChildren) {
  return (
    <LensProvider config={lensConfig}>
      <LensAuthProvider>{children}</LensAuthProvider>
    </LensProvider>
  )
}

export function LensAuthProvider({ children }: PropsWithChildren) {
  const [openLensLoginModal, setOpenLensLoginModal] = useState(false)

  const { execute: login, isPending: isLoginPending } = useWalletLogin()
  const { execute: lensLogout } = useWalletLogout()
  const { data: wallet, loading: walletLoading } = useActiveProfile()
  const { isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  })

  const { execute: updateDispatcher } = useUpdateDispatcherConfig({
    profile: wallet as ProfileOwnedByMe,
  })

  const updatedDispatcherFirst = useRef(false)
  useEffect(() => {
    if (updatedDispatcherFirst.current) return
    if (!wallet) return
    if (!wallet?.dispatcher) {
      updateDispatcher({ enabled: true }).finally(() => {
        updatedDispatcherFirst.current = true
      })
    }
  }, [wallet, updateDispatcher])

  const lensLogin = useCallback(async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    const { connector } = await connectAsync()

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient()
      const address = walletClient.account.address

      await login({
        address,
      })
    }
  }, [isConnected, disconnectAsync, connectAsync, login])

  const isLogin = useMemo(
    () => !isLoginPending && !!wallet && !walletLoading && isConnected,
    [isLoginPending, wallet, walletLoading, isConnected],
  )

  return (
    <LensAuthContext.Provider
      value={{
        isLogin,
        isLoginPending,
        lensLogin,
        lensLogout,
        openLensLoginModal,
        setOpenLensLoginModal,
      }}
    >
      {children}
      <LensLoginModal
        open={openLensLoginModal}
        closeModal={() => setOpenLensLoginModal(false)}
      />
    </LensAuthContext.Provider>
  )
}

export function useLensAuth() {
  const context = useContext(LensAuthContext)
  if (!context) {
    throw Error(
      'useLensAuth can only be used within the LensAuthProvider component',
    )
  }
  return context
}
