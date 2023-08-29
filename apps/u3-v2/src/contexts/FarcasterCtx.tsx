import { NobleEd25519Signer, bytesToHexString } from '@farcaster/hub-web'
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
import {
  FARCASTER_CLIENT_NAME,
  WARPCAST_REQUESTS_URL,
  WARPCAST_REQUEST_URL,
} from '../constants/farcaster'
import { generateKeyPair, getCurrFid } from '../utils/farsign-utils'
import { getFarcasterUserInfo } from '../api/farcaster'
import FarcasterQRModal from '../components/Modal/FarcasterQRModal'

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

export type SignerData = {
  token: string
  publicKey: string
  timestamp: number
  name: string
  fid: number
  messageHash: string
  base64SignedMessage: string
}

export type Signer = {
  signerRequest: SignerData
  isConnected: boolean
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
  const [signer, setSigner] = useState<Signer>({
    signerRequest: {
      token: '',
      publicKey: '',
      timestamp: 0,
      name: '',
      fid: 0,
      messageHash: '',
      base64SignedMessage: '',
    },
    isConnected: false,
  })
  const [showQR, setShowQR] = useState(false)
  const [token, setToken] = useState<Token>({
    token: '',
    deepLink: '',
  })

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
      const res = await fetch(`${WARPCAST_REQUEST_URL}?token=${token}`)
      const data = await res.json()
      if (data.result && data.result.signerRequest.base64SignedMessage) {
        localStorage.setItem(
          'farsign-signer-' + FARCASTER_CLIENT_NAME,
          JSON.stringify(data.result),
        )
        setSigner({
          signerRequest: data.result.signerRequest,
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
    const convertedKey = bytesToHexString(keyPair.publicKey)._unsafeUnwrap()
    const res = await fetch(WARPCAST_REQUESTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey: convertedKey,
        name: FARCASTER_CLIENT_NAME,
      }),
    })
    const json = await res.json()
    const { token, deepLinkUrl } = json.result

    localStorage.setItem(
      'farsign-privateKey-' + FARCASTER_CLIENT_NAME,
      keyPair.privateKey.toString(),
    )

    pollForSigner(token)
    setShowQR(true)
    setToken({ token: token, deepLink: deepLinkUrl })
  }, [pollForSigner])

  const openFarcasterQR = () => {
    stopSign.stop = false
    initWarpcastAuth()
    setOpenQR(true)
  }

  const encryptedSigner = useMemo(() => {
    if (!signer.isConnected) return undefined
    const privateKey = localStorage.getItem(
      'farsign-privateKey-' + FARCASTER_CLIENT_NAME,
    )!

    const privateKey_encoded = Uint8Array.from(
      privateKey.split(',').map((split) => Number(split)),
    )
    return new NobleEd25519Signer(privateKey_encoded)
  }, [signer.isConnected])

  useEffect(() => {
    if (signer.isConnected) {
      getCurrUserInfo()
    }
  }, [signer.isConnected])

  useEffect(() => {
    const signer = localStorage.getItem(
      'farsign-signer-' + FARCASTER_CLIENT_NAME,
    )

    if (signer != null) {
      setToken({
        token: 'already connected',
        deepLink: 'already connected',
      })
      setSigner({
        signerRequest: JSON.parse(signer).signerRequest,
        isConnected: true,
      })
    }
  }, [])

  console.log('farcaster', signer.isConnected)

  return (
    <FarcasterContext.Provider
      value={{
        currFid,
        currUserInfo,
        isConnected: signer.isConnected,
        token,
        encryptedSigner,
        openFarcasterQR,
      }}
    >
      {children}
      <FarcasterQRModal
        showQR={showQR}
        open={openQRModal}
        closeModal={() => {
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
