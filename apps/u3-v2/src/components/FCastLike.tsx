import styled from 'styled-components'
import { FarCast } from '../api'
import { useFarcasterCtx } from '../contexts/farcaster'
import {
  CastId,
  ReactionType,
  UserDataType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '../constants/farcaster'
import useFarcasterUserData from '../hooks/useFarcasterUserData'
import useFarcasterCurrFid from '../hooks/useFarcasterCurrFid'
import useFarcasterCastId from '../hooks/useFarcasterCastId'

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
      const request = JSON.parse(
        localStorage.getItem('farsign-signer-' + FARCASTER_CLIENT_NAME)!,
      ).signerRequest
      try {
        const cast = await makeReactionAdd(
          {
            type: ReactionType.LIKE,
            targetCastId: castId,
          },
          {
            fid: request.fid,
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
        tmpSet.add(request.fid + '')
        setLikes(Array.from(tmpSet))
        setLikeCount(likeCount + 1)

        toast.success('like post created')
      } catch (error) {
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
      const request = JSON.parse(
        localStorage.getItem('farsign-signer-' + FARCASTER_CLIENT_NAME)!,
      ).signerRequest
      try {
        const cast = await makeReactionRemove(
          {
            type: ReactionType.LIKE,
            targetCastId: castId,
          },
          {
            fid: request.fid,
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
        tmpSet.delete(request.fid + '')
        setLikes(Array.from(tmpSet))
        setLikeCount(likeCount - 1)

        toast.success('like post created')
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
      <div>
        {likes.map((item) => {
          return (
            <LikeAvatar
              key={item}
              fid={item}
              farcasterUserData={farcasterUserData}
            />
          )
        })}
      </div>
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
}: {
  fid: string
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
}) {
  const userData = useFarcasterUserData({ fid: fid, farcasterUserData })
  if (userData.pfp) {
    return (
      <LikeAvatarBox>
        <img src={userData.pfp} alt="" />
      </LikeAvatarBox>
    )
  }
  if (userData.display) {
    return <LikeAvatarBox>{userData.display}</LikeAvatarBox>
  }
  return <LikeAvatarBox>{userData.fid}</LikeAvatarBox>
}

const LikesBox = styled.div`
  display: flex;
`

const LikeAvatarBox = styled.div`
  > img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
`
