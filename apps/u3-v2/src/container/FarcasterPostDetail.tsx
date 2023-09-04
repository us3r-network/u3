import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFarcasterCastInfo } from '../api/farcaster'
import { FarCast } from '../api'
import FCast from '../components/farcaster/FCast'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import GoBack from '../components/GoBack'
import {
  PostDetailCommentsWrapper,
  PostDetailWrapper,
} from '../components/common/PostDetail'
import Loading from '../components/common/loading/Loading'
import styled from 'styled-components'

export default function FarcasterPostDetail() {
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
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    )
  }
  if (cast) {
    return (
      <div>
        <GoBack />
        <PostDetailWrapper>
          <FCast
            cast={cast}
            openFarcasterQR={openFarcasterQR}
            farcasterUserData={farcasterUserData}
          />
          <PostDetailCommentsWrapper>
            {(comments || []).map((item) => {
              const key = Buffer.from(item.data.hash.data).toString('hex')
              return (
                <FCast
                  key={key}
                  cast={item.data}
                  openFarcasterQR={openFarcasterQR}
                  farcasterUserData={farcasterUserData}
                />
              )
            })}
          </PostDetailCommentsWrapper>
        </PostDetailWrapper>
      </div>
    )
  }
  return null
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
