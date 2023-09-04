import { NobleEd25519Signer } from '@farcaster/hub-web'
import { createPublicClient, http } from 'viem'
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { goerli } from 'viem/chains'
import { WARPCAST_API } from '../constants/farcaster'
import {
  generateKeyPair,
  getCurrFid,
  getPrivateKey,
  getSignedKeyRequest,
  setPrivateKey,
  setSignedKeyRequest,
} from '../utils/farsign-utils'
import { getFarcasterSignature, getFarcasterUserInfo } from '../api/farcaster'
import FarcasterQRModal from '../components/Modal/FarcasterQRModal'
import axios from 'axios'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export type Token = {
  token: string
  deepLink: string
}

export type Keypair = {
  privateKey: Uint8Array
  publicKey: Uint8Array
}

export type SignedKeyRequestData = {
  deeplinkUrl: string
  key: string
  requestFid: number
  state: 'completed' | 'pending' | 'approved'
  token: string
  userFid: number
}

export type Signer = {
  SignedKeyRequest: SignedKeyRequestData
  isConnected: boolean
}

export type FarcasterUserData = {
  [key: string]: { type: number; value: string }[]
}
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
  openFarcasterQR: () => void
  farcasterUserData: FarcasterUserData
  setFarcasterUserData: React.Dispatch<React.SetStateAction<FarcasterUserData>>
}

const FarcasterContext = createContext<FarcasterContextData | null>(null)

const stopSign = {
  stop: false,
}

export default function FarcasterProvider({
  children,
}: {
  children: ReactNode
}) {
  const [farcasterUserData, setFarcasterUserData] = useState<FarcasterUserData>(
    {},
  )

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
  })
  const [showQR, setShowQR] = useState(false)
  const [token, setToken] = useState<Token>({
    token: '',
    deepLink: '',
  })
  const [warpcastErr, setWarpcastErr] = useState<string>('')

  const [currUserInfo, setCurrUserInfo] = useState<{
    [key: string]: { type: number; value: string }[]
  }>()
  const [currFid, setCurrFid] = useState<number>()
  const [openQR, setOpenQR] = useState(false)

  const openQRModal = useMemo(() => {
    if (signer.isConnected) {
      return false
    }
    return openQR
  }, [signer.isConnected, openQR])

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

  const pollForSigner = useCallback(async (token: string) => {
    let tries = 0

    while (true || tries < 40) {
      if (stopSign.stop) {
        break
      }
      tries += 1
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const { signedKeyRequest } = await axios
        .get(`${WARPCAST_API}/v2/signed-key-request`, {
          params: {
            token,
          },
        })
        .then((response) => response.data.result)

      if (signedKeyRequest.state === 'completed') {
        setSignedKeyRequest(signedKeyRequest)

        setSigner({
          SignedKeyRequest: signedKeyRequest,
          isConnected: true,
        })
        break
      }
    }

    setTimeout(() => {
      setOpenQR(false)
    }, 500)
  }, [])

  const initWarpcastAuth = useCallback(async () => {
    const keyPair = await generateKeyPair()
    const convertedKey = '0x' + keyPair.publicKey

    const resp = await getFarcasterSignature(convertedKey)
    if (resp.status !== 200) {
      console.error(resp.status)
      setWarpcastErr('Internal server error')
      return
    }
    const { signature, appFid, deadline } = resp.data.data

    const { token, deeplinkUrl } = await axios
      .post(`${WARPCAST_API}/v2/signed-key-requests`, {
        key: convertedKey,
        requestFid: appFid,
        signature,
        deadline,
      })
      .then((response) => response.data.result.signedKeyRequest)

    setPrivateKey(keyPair.privateKey)
    pollForSigner(token)
    setShowQR(true)
    setToken({ token: token, deepLink: deeplinkUrl })
  }, [pollForSigner])

  const openFarcasterQR = () => {
    stopSign.stop = false
    initWarpcastAuth()
    setOpenQR(true)
  }

  const encryptedSigner = useMemo(() => {
    if (!signer.isConnected) return undefined
    const privateKey = getPrivateKey()

    return new NobleEd25519Signer(Buffer.from(privateKey, 'hex'))
  }, [signer.isConnected])

  useEffect(() => {
    if (signer.isConnected) {
      getCurrUserInfo()
    }
  }, [signer.isConnected])

  useEffect(() => {
    const signer = getSignedKeyRequest()

    if (signer != null) {
      setToken({
        token: 'already connected',
        deepLink: 'already connected',
      })
      setSigner({
        SignedKeyRequest: JSON.parse(signer),
        isConnected: true,
      })
    }
  }, [])

  return (
    <FarcasterContext.Provider
      value={{
        currFid,
        currUserInfo,
        isConnected: signer.isConnected,
        token,
        encryptedSigner,
        openFarcasterQR,
        farcasterUserData,
        setFarcasterUserData,
      }}
    >
      {children}
      <FarcasterQRModal
        warpcastErr={warpcastErr}
        showQR={showQR}
        open={openQRModal}
        closeModal={() => {
          setWarpcastErr('')
          setOpenQR(false)
        }}
        token={token}
        afterCloseAction={() => {
          setShowQR(false)
          stopSign.stop = true
        }}
      />
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
