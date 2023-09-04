import { Comment } from '@lens-protocol/react-web'
import { useLensCtx } from '../../contexts/AppLensCtx'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { lensPublicationToReplyCardData } from '../../utils/lens-ui-utils'
import { useCreateLensComment } from '../../hooks/lens/useCreateLensComment'
import ReplyCard, { ReplyCardData } from '../common/ReplyCard'
import { useReactionLensUpvote } from '../../hooks/lens/useReactionLensUpvote'
import { useCreateLensMirror } from '../../hooks/lens/useCreateLensMirror'
import LensPostCardContent from './LensPostCardContent'

export default function LensReplyCard({ data }: { data: Comment }) {
  const navigate = useNavigate()
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx()

  const {
    toggleReactionUpvote,
    hasUpvote,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication: data,
  })

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication: data,
  })

  const [updatedPublication, setUpdatedPublication] = useState<Comment | null>(
    null,
  )

  useEffect(() => {
    setUpdatedPublication(data)
  }, [data])

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.publicationId !== data.id) return
      setUpdatedPublication((prev) => {
        if (!prev) return prev
        const stats = prev.stats
        return {
          ...prev,
          stats: {
            ...stats,
            totalAmountOfComments: stats.totalAmountOfComments + 1,
          },
        }
      })
    },
  })

  const cardData = useMemo<ReplyCardData>(
    () => lensPublicationToReplyCardData(updatedPublication),
    [updatedPublication],
  )

  return (
    <ReplyCard
      contentRender={() => (
        <LensPostCardContent publication={updatedPublication as Comment} />
      )}
      onClick={() => {
        navigate(`/post-detail/lens/${data.id}`)
      }}
      data={cardData}
      liked={hasUpvote}
      liking={isPendingReactionUpvote}
      likeAction={() => {
        if (!isLogin) {
          setOpenLensLoginModal(true)
          return
        }
        toggleReactionUpvote()
      }}
      replying={false}
      replyAction={() => {
        if (!isLogin) {
          setOpenLensLoginModal(true)
          return
        }
        if (!data?.canComment?.result) {
          toast.error('No comment permission')
          return
        }
        setCommentModalData(data)
        setOpenCommentModal(true)
      }}
      reposting={isPendingMirror}
      repostAction={() => {
        if (!isLogin) {
          setOpenLensLoginModal(true)
          return
        }
        if (!data?.canMirror?.result) {
          toast.error('No mirror permission')
          return
        }
        createMirror()
      }}
    />
  )
}
