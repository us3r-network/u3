import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import {
  LensProvider,
  LensConfig,
  development,
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
} from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

interface LensAuthContextValue {
  isLogin: boolean
  isLoginPending: boolean
  lensLogin: () => void
  lensLogout: () => void
}
export const LensAuthContext = createContext<LensAuthContextValue>({
  isLogin: false,
  isLoginPending: false,
  lensLogin: () => {},
  lensLogout: () => {},
})

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
}

export function AppLensProvider({ children }: PropsWithChildren) {
  return (
    <LensProvider config={lensConfig}>
      <LensAuthProvider>{children}</LensAuthProvider>
    </LensProvider>
  )
}

export function LensAuthProvider({ children }: PropsWithChildren) {
  const { execute: login, isPending: isLoginPending } = useWalletLogin()
  const { execute: lensLogout } = useWalletLogout()
  const {
    data: wallet,
    error: walletError,
    loading: walletLoading,
  } = useActiveProfile()

  console.log({
    wallet,
    walletError,
    walletLoading,
  })

  const { isConnected } = useAccount()
  const { disconnectAsync } = useDisconnect()

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  })

  const lensLogin = useCallback(async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    const { connector } = await connectAsync()

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient()

      await login({
        address: walletClient.account.address,
      })
    }
  }, [isConnected, disconnectAsync, connectAsync, login])

  const isLogin = useMemo(
    () => !isLoginPending && !!wallet && !walletLoading,
    [isLoginPending, wallet, walletLoading],
  )

  return (
    <LensAuthContext.Provider
      value={{ isLogin, isLoginPending, lensLogin, lensLogout }}
    >
      {children}
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
