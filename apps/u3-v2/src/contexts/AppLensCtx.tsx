import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
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
} from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { LENS_ENV } from '../constants/lens'
import LensLoginModal from '../components/lens/LensLoginModal'
import {
  LensClient,
  development as dev,
  isRelayerResult,
  production as prod,
} from '@lens-protocol/client'

interface LensAuthContextValue {
  isLogin: boolean
  isLoginPending: boolean
  lensLogin: () => void
  lensLogout: () => void
  openLensLoginModal: boolean
  setOpenLensLoginModal: (open: boolean) => void
}

const lensClient = new LensClient({
  environment: LENS_ENV === 'production' ? prod : dev,
})

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

  const lensLogin = useCallback(async () => {
    if (isConnected) {
      await disconnectAsync()
    }
    const { connector } = await connectAsync()

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient()
      const address = walletClient.account.address

      const res = await login({
        address,
      })
      const activeProfile = (res as any)?.value

      if (!activeProfile?.dispatcher) {
        const challenge =
          await lensClient.authentication.generateChallenge(address)
        const signature = await (walletClient as any).signMessage({
          message: challenge,
        })
        await lensClient.authentication.authenticate(address, signature)

        const typedDataResult =
          await lensClient.profile.createSetDispatcherTypedData({
            profileId: activeProfile.id,
          })

        // typedDataResult is a Result object
        const data = typedDataResult.unwrap()

        // sign with the wallet
        const signedTypedData = await (walletClient as any).signTypedData({
          account: address,
          domain: data.typedData.domain,
          primaryType: 'SetDispatcherWithSig',
          types: data.typedData.types,
          message: data.typedData.value,
        })
        // broadcast
        const broadcastResult = await lensClient.transaction.broadcast({
          id: data.id,
          signature: signedTypedData,
        })

        // broadcastResult is a Result object
        const broadcastResultValue = broadcastResult.unwrap()
        if (!isRelayerResult(broadcastResultValue)) {
          console.log(`Something went wrong`, broadcastResultValue)
          return
        }

        console.log(
          `Transaction was successfuly broadcasted with txId ${broadcastResultValue.txId}`,
        )
      }
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
