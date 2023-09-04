import { useMemo } from 'react'
import { getCurrFid } from '../utils/farsign-utils'

export default function useFarcasterCurrFid() {
  const currFid: string = useMemo(() => {
    const fid = getCurrFid()
    return fid + ''
  }, [])
  return currFid
}
