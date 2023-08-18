import styled from 'styled-components'
import { FarCast } from '../api'
// import { useFarcasterReactionCast } from '../hooks/useFarcaster'
import { useFarcasterCtx } from '../contexts/farcaster'
import { CastId, ReactionType, makeReactionAdd } from '@farcaster/hub-web'
import { useCallback, useMemo, useState } from 'react'
import CommentPostModal from './Modal/CommentPostModal'
import { toast } from 'react-toastify'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '../constants/farcaster'

export default function FCast({
  cast,
  openFarcasterQR,
}: {
  cast: FarCast
  openFarcasterQR: () => void
}) {
  const { encryptedSigner, isConnected } = useFarcasterCtx()

  const [openComment, setOpenComment] = useState(false)

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
        toast.success('like post created')
      } catch (error) {
        toast.error('error like')
      }
    },
    [encryptedSigner, isConnected, openFarcasterQR],
  )

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

  const castId: CastId = useMemo(() => {
    return {
      fid: Number(cast.fid),
      hash: Uint8Array.from(cast.hash.data),
    }
  }, [cast])

  return (
    <CastBox>
      <div>
        <span>{cast.fid}: </span>
        {cast.text}
      </div>
      <small>{cast.created_at}</small>
      <div>
        <button
          onClick={() => {
            if (!isConnected) {
              openFarcasterQR()
              return
            }
            setOpenComment(true)
          }}
        >
          commentCast
        </button>
        <button onClick={() => likeCast(castId)}>likeCast</button>
        <button onClick={() => repostCast(castId)}>repostCast</button>
      </div>
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
