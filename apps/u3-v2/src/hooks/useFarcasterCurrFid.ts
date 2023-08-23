import { useMemo } from 'react'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'

export default function useFarcasterCurrFid() {
  const currFid: string = useMemo(() => {
    const request = (
      JSON.parse(
        localStorage.getItem('farsign-signer-' + FARCASTER_CLIENT_NAME)!,
      ) || {}
    ).signerRequest
    if (request) {
      return request.fid + ''
    }
    return ''
  }, [])
  return currFid
}
