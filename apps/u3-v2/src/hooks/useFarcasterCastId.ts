import { CastId } from '@farcaster/hub-web'
import { useMemo } from 'react'
import { FarCast } from '../api'

export default function useFarcasterCastId({ cast }: { cast: FarCast }) {
  const castId: CastId = useMemo(() => {
    return {
      fid: Number(cast.fid),
      hash: Uint8Array.from(cast.hash.data),
    }
  }, [cast])
  return castId
}
