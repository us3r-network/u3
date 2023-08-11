import { ethers } from 'ethers'
import { FARCASTER_ABI, FARCASTER_ADDRESS } from '../constants/farcaster'
import { PublicClient } from 'viem'

import {
  TypedDataDomain,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from 'viem'
import { goerli } from 'viem/chains'
import { MinimalEthersSigner } from '@farcaster/hub-web'

export const walletClient = createWalletClient({
  chain: goerli,
  transport: custom((window as any).ethereum),
})

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
})

export const farcasterSigner: MinimalEthersSigner = {
  getAddress: async (): Promise<string> => {
    // const address = walletClient.account.address
    // console.log({ address })
    const [address] = await walletClient.getAddresses()
    return address
  },
  // TODO: elegant trans to viem signTypedData
  signTypedData: async (
    domain: TypedDataDomain,
    types: Record<string, Array<any>>,
    value: Record<string, any>,
  ): Promise<string> => {
    const [address] = await walletClient.getAddresses()
    const rr = await walletClient.signTypedData({
      account: address,
      domain,
      types: types,
      message: {
        hash: '0x' + Buffer.from(value.hash).toString('hex'),
      },
      primaryType: 'MessageData',
    })
    return rr
  },
}

export const getFid = async (
  provider: ethers.ContractRunner,
  address: string,
) => {
  const farcasterContract = new ethers.Contract(
    FARCASTER_ADDRESS,
    FARCASTER_ABI,
    provider,
  )
  const fid: BigInt = await farcasterContract['idOf'](address)
  return Number(fid)
}

export const getFidFromClient = async (
  client: PublicClient,
  address: string,
) => {
  const fid = await client.readContract({
    address: FARCASTER_ADDRESS,
    abi: FARCASTER_ABI,
    functionName: 'idOf',
    args: [address],
  })
  console.log('fid', fid)
  return Number(fid)
}
