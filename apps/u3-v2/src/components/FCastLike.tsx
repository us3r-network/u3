import styled from 'styled-components'
import { FarCast } from '../api'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import {
  CastId,
  ReactionType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '../constants/farcaster'
import useFarcasterUserData from '../hooks/useFarcasterUserData'
import useFarcasterCurrFid from '../hooks/useFarcasterCurrFid'
import useFarcasterCastId from '../hooks/useFarcasterCastId'
import { getCurrFid } from '../utils/farsign-utils'

export default function FCastLike({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  openFarcasterQR: () => void
}) {
  const { encryptedSigner, isConnected } = useFarcasterCtx()
  const [likes, setLikes] = useState<string[]>(Array.from(new Set(cast.likes)))
  const [likeCount, setLikeCount] = useState<number>(
    Number(cast.like_count || 0),
  )

  const likeCast = useCallback(
    async (castId: CastId) => {
      if (!isConnected) {
        openFarcasterQR()
        return
      }
      if (!encryptedSigner) return
      const currFid = getCurrFid()
      try {
        const cast = await makeReactionAdd(
          {
            type: ReactionType.LIKE,
            targetCastId: castId,
          },
          {
            fid: currFid,
            network: FARCASTER_NETWORK,
          },
          encryptedSigner,
        )
        if (cast.isErr()) {
          throw new Error(cast.error.message)
        }

        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast.value)
        if (result.isErr()) {
          throw new Error(result.error.message)
        }

        const tmpSet = new Set(likes)
        tmpSet.add(currFid + '')
        setLikes(Array.from(tmpSet))
        setLikeCount(likeCount + 1)

        toast.success('like post created')
      } catch (error) {
        console.error(error)
        toast.error('error like')
      }
    },
    [encryptedSigner, isConnected, likeCount, likes, openFarcasterQR],
  )

  const removeLikeCast = useCallback(
    async (castId: CastId) => {
      if (!isConnected) {
        openFarcasterQR()
        return
      }
      if (!encryptedSigner) return
      const currFid = getCurrFid()
      try {
        const cast = await makeReactionRemove(
          {
            type: ReactionType.LIKE,
            targetCastId: castId,
          },
          {
            fid: currFid,
            network: FARCASTER_NETWORK,
          },
          encryptedSigner,
        )
        if (cast.isErr()) {
          throw new Error(cast.error.message)
        }

        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast.value)
        if (result.isErr()) {
          throw new Error(result.error.message)
        }

        const tmpSet = new Set(likes)
        tmpSet.delete(currFid + '')
        setLikes(Array.from(tmpSet))
        setLikeCount(likeCount - 1)

        toast.success('like post removed')
      } catch (error) {
        toast.error('error like')
      }
    },
    [encryptedSigner, isConnected, likeCount, likes, openFarcasterQR],
  )

  const currFid: string = useFarcasterCurrFid()
  const castId: CastId = useFarcasterCastId({ cast })

  return (
    <LikesBox>
      <AvatarContainerBox len={likes.length}>
        {likes.map((item, idx) => {
          return (
            <LikeAvatar
              key={item}
              fid={item}
              idx={idx}
              farcasterUserData={farcasterUserData}
            />
          )
        })}
      </AvatarContainerBox>
      <button
        onClick={() => {
          if (likes.includes(currFid)) {
            removeLikeCast(castId)
          } else {
            likeCast(castId)
          }
        }}
      >
        likeCast({likeCount})
      </button>
    </LikesBox>
  )
}

function LikeAvatar({
  farcasterUserData,
  fid,
  idx,
}: {
  fid: string
  idx: number
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
}) {
  const userData = useFarcasterUserData({ fid: fid, farcasterUserData })
  if (userData.pfp) {
    return (
      <LikeAvatarBox idx={idx}>
        <img src={userData.pfp} alt="" />
      </LikeAvatarBox>
    )
  }
  if (userData.display) {
    return <LikeAvatarBox idx={idx}>{userData.display}</LikeAvatarBox>
  }
  return <LikeAvatarBox idx={idx}>{userData.fid}</LikeAvatarBox>
}

const LikesBox = styled.div`
  display: flex;
`

const AvatarContainerBox = styled.div<{ len: number }>`
  display: flex;
  position: relative;
  width: ${(props) => (props.len ? props.len * 16 + 10 + 'px' : '0px')};
`

const LikeAvatarBox = styled.div<{ idx: number }>`
  position: absolute;
  left: ${(props) => props.idx * 16 + 'px'};
  border: 1px solid white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  > img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`
