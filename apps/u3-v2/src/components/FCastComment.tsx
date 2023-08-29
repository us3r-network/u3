import { useState } from 'react'
import { FarCast } from '../api'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import CommentPostModal from './Modal/CommentPostModal'
import { CastId } from '@farcaster/hub-web'
import useFarcasterCastId from '../hooks/useFarcasterCastId'

export default function FCastComment({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  openFarcasterQR: () => void
}) {
  const [commentCount, setCommentCount] = useState(
    Number(cast.comment_count || 0),
  )
  const [openComment, setOpenComment] = useState(false)
  const { isConnected } = useFarcasterCtx()
  const castId: CastId = useFarcasterCastId({ cast })
  return (
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
        commentCast({commentCount})
      </button>

      <CommentPostModal
        cast={cast}
        farcasterUserData={farcasterUserData}
        castId={castId}
        open={openComment}
        closeModal={(withInc) => {
          if (withInc) {
            setCommentCount((pre) => pre + 1)
          }
          setOpenComment(false)
        }}
      />
    </div>
  )
}
