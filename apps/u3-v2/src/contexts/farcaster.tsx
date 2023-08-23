import { NobleEd25519Signer } from '@farcaster/hub-web'
import { createPublicClient, http } from 'viem'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useCheckSigner,
  useToken,
  useSigner,
  useEncryptedSigner,
  Token,
} from '../hooks/useFarsign'

import { goerli } from 'viem/chains'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'
import { getCurrFid } from '../utils/farsign-utils'
import { getFarcasterUserInfo } from '../api/farcaster'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export interface FarcasterContextData {
  currFid: number | undefined
  currUserInfo:
    | {
        [key: string]: { type: number; value: string }[]
      }
    | undefined
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
  const [currUserInfo, setCurrUserInfo] = useState<{
    [key: string]: { type: number; value: string }[]
  }>()
  const [currFid, setCurrFid] = useState<number>()

  const getCurrUserInfo = async () => {
    const currFid = getCurrFid()
    const resp = await getFarcasterUserInfo([currFid])
    if (resp.data.code === 0) {
      const data: {
        [key: string]: { type: number; value: string }[]
      } = {}
      data[currFid] = resp.data.data
      setCurrUserInfo(data)
      setCurrFid(currFid)
    }
  }

  useEffect(() => {
    if (signer.isConnected === true) {
      setIsConnected(true)
    }
  }, [setIsConnected, signer])

  useEffect(() => {
    if (isConnected) {
      getCurrUserInfo()
    }
  }, [isConnected])

  return (
    <FarcasterContext.Provider
      value={{
        currFid,
        currUserInfo,
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
