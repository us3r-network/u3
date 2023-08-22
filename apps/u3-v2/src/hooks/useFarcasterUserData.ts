import { UserDataType } from '@farcaster/hub-web'
import { useMemo } from 'react'

export default function useFarcasterUserData({
  farcasterUserData,
  fid,
}: {
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  fid: string
}) {
  const userData = useMemo(() => {
    const data = farcasterUserData[fid] || []
    const pfp = data.find((item) => item.type === UserDataType.PFP)?.value || ''
    const display =
      data.find((item) => item.type === UserDataType.DISPLAY)?.value || ''
    const bio = data.find((item) => item.type === UserDataType.BIO)?.value || ''
    const userName =
      data.find((item) => item.type === UserDataType.USERNAME)?.value || ''
    const url = data.find((item) => item.type === UserDataType.URL)?.value
    return {
      fid,
      pfp,
      bio,
      userName,
      display,
      url,
    }
  }, [fid, farcasterUserData])

  return userData
}
