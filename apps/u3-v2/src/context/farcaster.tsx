import { MinimalEthersSigner } from '@farcaster/hub-web'
import { TypedDataDomain, createPublicClient, http } from 'viem'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { goerli } from 'viem/chains'
import { getFidFromClient } from '../utils/farcaster'
import { useEthers } from '../hooks/useEthers'
import { TypedDataField } from 'ethers'

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export interface FarcasterContextData {
  fid: number | undefined
  farcasterSigner: MinimalEthersSigner | undefined
}

const FarcasterContext = createContext<FarcasterContextData | null>(null)

export default function FarcasterProvider({
  children,
}: {
  children: ReactNode
}) {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { ethersProvider } = useEthers()
  const [fid, setFid] = useState<number>()

  const farcasterSigner: MinimalEthersSigner | undefined = useMemo(() => {
    if (!walletClient || !ethersProvider) return undefined

    return {
      getAddress: async (): Promise<string> => {
        const address = walletClient.account.address
        return address
      },

      signTypedData: async (
        domain: TypedDataDomain,
        types: Record<string, Array<TypedDataField>>,
        value: Record<string, any>,
      ): Promise<string> => {
        // TODO: wagmi method to sign typed data
        const signer = await ethersProvider.getSigner()
        return signer.signTypedData(domain, types, value)
      },
    }
  }, [walletClient, ethersProvider])

  useEffect(() => {
    if (!address) return
    getFidFromClient(publicClient, address).then((fid) => {
      setFid(fid)
    })
  }, [address])

  return (
    <FarcasterContext.Provider
      value={{
        fid,
        farcasterSigner,
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
