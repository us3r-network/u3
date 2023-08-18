import { NobleEd25519Signer } from '@farcaster/hub-web'
import { createPublicClient, http } from 'viem'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
} from 'react'
import {
  useCheckSigner,
  useToken,
  useSigner,
  useEncryptedSigner,
  Token,
} from '../hooks/useFarsign'

import { goerli } from 'viem/chains'
import { FARCASTER_CLIENT_NAME } from '../constants'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export interface FarcasterContextData {
  isConnected: boolean
  token: Token
  encryptedSigner: NobleEd25519Signer | undefined
}

const FarcasterContext = createContext<FarcasterContextData | null>(null)

export default function FarcasterProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isConnected, setIsConnected] = useCheckSigner(
    FARCASTER_CLIENT_NAME,
  ) as [boolean, Dispatch<SetStateAction<boolean>>]
  const [token] = useToken(FARCASTER_CLIENT_NAME)
  const [signer] = useSigner(FARCASTER_CLIENT_NAME, token)
  const [encryptedSigner] = useEncryptedSigner(FARCASTER_CLIENT_NAME, token)

  useEffect(() => {
    if (signer.isConnected === true) {
      setIsConnected(true)
    }
  }, [setIsConnected, signer])

  return (
    <FarcasterContext.Provider
      value={{
        isConnected,
        token,
        encryptedSigner,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  )
}

export function useFarcasterCtx() {
  const context = useContext(FarcasterContext)
  if (!context) {
    throw new Error('Missing context')
  }
  return {
    ...context,
  }
}
