import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFarcasterCastInfo } from '../api/farcaster'
import { FarCast } from '../api'
import FCast from '../components/FCast'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'

export default function PostDetail() {
  const { castId } = useParams()
  const [loading, setLoading] = useState(false)
  const [cast, setCast] = useState<FarCast>()
  const { openFarcasterQR } = useFarcasterCtx()
  const [comments, setComments] =
    useState<{ data: FarCast; platform: 'farcaster' }[]>()
  const [farcasterUserData, setFarcasterUserData] = useState<{
    [key: string]: { type: number; value: string }[]
  }>({})

  const loadCastInfo = useCallback(async () => {
    if (!castId) return
    try {
      setLoading(true)
      const resp = await getFarcasterCastInfo(castId, {})
      console.log(resp.data.data)
      if (resp.data.code !== 0) {
        throw new Error(resp.data.msg)
      }
      const { farcasterUserData, cast, comments } = resp.data.data
      const temp: { [key: string]: { type: number; value: string }[] } = {}
      farcasterUserData.forEach((item) => {
        if (temp[item.fid]) {
          temp[item.fid].push(item)
        } else {
          temp[item.fid] = [item]
        }
      })
      setCast(cast)
      setFarcasterUserData((pre) => ({ ...pre, ...temp }))
      setComments(comments)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [castId])

  useEffect(() => {
    loadCastInfo()
  }, [loadCastInfo])

  if (loading) {
    return <div>Loading</div>
  }

  if (cast) {
    return (
      <div>
        <FCast
          cast={cast}
          openFarcasterQR={openFarcasterQR}
          farcasterUserData={farcasterUserData}
        />
        {(comments || []).map((item) => {
          const key = Buffer.from(item.data.hash.data).toString('hex')
          return (
            <div key={key}>
              <FCast
                key={key}
                cast={item.data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={farcasterUserData}
              />
            </div>
          )
        })}
      </div>
    )
  }
  return null
}
