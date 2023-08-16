import styled from 'styled-components'
import { FarCast } from '../api'
import { useFarcasterReactionCast } from '../hooks/useFarcaster'
import { useFarcasterCtx } from '../context/farcaster'
import { CastId, ReactionType } from '@farcaster/hub-web'
import { useCallback, useMemo, useState } from 'react'
import CommentPostModal from './Modal/CommentPostModal'
import { toast } from 'react-toastify'

export default function FCast({ cast }: { cast: FarCast }) {
  const { farcasterSigner, fid } = useFarcasterCtx()
  const { reactionCast } = useFarcasterReactionCast({
    signer: farcasterSigner,
    fid,
  })

  const [openComment, setOpenComment] = useState(false)

  const likeCast = useCallback(
    async (castId: CastId) => {
      if (!fid) return
      try {
        const r = await reactionCast(castId, ReactionType.LIKE)
        if (r) {
          throw new Error('error')
        }
        toast.success('like post created')
      } catch (error) {
        toast.error('error like')
      }
    },
    [fid, reactionCast],
  )

  const repostCast = useCallback(
    async (castId: CastId) => {
      if (!fid) return
      try {
        const r = await reactionCast(castId, ReactionType.RECAST)
        if (r) {
          throw new Error('error')
        }
        toast.success('recast post created')
      } catch (error) {
        toast.error('error recast')
      }
    },
    [fid, reactionCast],
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
        <button onClick={() => setOpenComment(true)}>commentCast</button>
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
