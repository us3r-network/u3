import { ethers } from 'ethers'
import { FARCASTER_ABI, FARCASTER_ADDRESS } from '../constants/farcaster'

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
