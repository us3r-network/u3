import styled from 'styled-components'
import { FarCast } from '../api'
// import { useFarcasterReactionCast } from '../hooks/useFarcaster'
import { useFarcasterCtx } from '../contexts/farcaster'
import {
  CastId,
  ReactionType,
  UserDataType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web'
import { useCallback, useMemo, useState } from 'react'
import CommentPostModal from './Modal/CommentPostModal'
import { toast } from 'react-toastify'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '../constants/farcaster'
import useFarcasterUserData from '../hooks/useFarcasterUserData'
import useFarcasterCastId from '../hooks/useFarcasterCastId'
import FCastLike from './FCastLike'

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  openFarcasterQR: () => void
}) {
  const { encryptedSigner, isConnected } = useFarcasterCtx()

  const [openComment, setOpenComment] = useState(false)

  const repostCast = useCallback(
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
            type: ReactionType.RECAST,
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
        toast.success('like post created')
      } catch (error) {
        toast.error('error like')
      }
    },
    [encryptedSigner, isConnected, openFarcasterQR],
  )

  const castId: CastId = useFarcasterCastId({ cast })
  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData })

  return (
    <CastBox>
      <UserDataBox>
        <div>{userData.pfp && <img src={userData.pfp} alt="" />}</div>
        <div>
          <div>{userData.display} </div>
          <div>{userData.fid} </div>
        </div>
      </UserDataBox>
      <div>{cast.text}</div>
      <small>{cast.created_at}</small>
      <CastTools>
        <FCastLike
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
        <button onClick={() => repostCast(castId)}>
          repostCast({cast.repost_count || 0})
        </button>
        <button
          onClick={() => {
            if (!isConnected) {
              openFarcasterQR()
              return
            }
            setOpenComment(true)
          }}
        >
          commentCast({cast.comment_count})
        </button>
      </CastTools>
      <CommentPostModal
        castId={castId}
        open={openComment}
        closeModal={() => setOpenComment(false)}
      />
    </CastBox>
  )
}

const CastBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #eee;
  gap: 10px;
`

const UserDataBox = styled.div`
  display: flex;
  gap: 20px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`

const CastTools = styled.div`
  display: flex;
  gap: 10px;
`
