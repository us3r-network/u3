import { LensPublication } from '../../api/lens'
import { Post } from '@lens-protocol/react-web'
import { useLensCtx } from '../../contexts/AppLensCtx'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import PostCard, { PostCardData } from '../common/PostCard'
import { lensPublicationToPostCardData } from '../../utils/lens-ui-utils'
import { useCreateLensComment } from '../../hooks/lens/useCreateLensComment'
import { useReactionLensUpvote } from '../../hooks/lens/useReactionLensUpvote'
import { useCreateLensMirror } from '../../hooks/lens/useCreateLensMirror'
import LensPostCardContent from './LensPostCardContent'

export default function LensPostDetailCard({
  data,
}: {
  data: LensPublication
}) {
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx()

  const publication = data as unknown as Post

  const {
    toggleReactionUpvote,
    hasUpvote,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication,
  })

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication,
  })

  const [updatedPublication, setUpdatedPublication] = useState<Post | null>(
    null,
  )

  useEffect(() => {
    setUpdatedPublication(publication)
    console.log({ publication })
  }, [publication])

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.publicationId !== publication.id) return

      setUpdatedPublication((prev) => {
        if (!prev) return prev
        const stats = prev.stats
        console.log({ stats })
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

  const cardData = useMemo<PostCardData>(
    () => lensPublicationToPostCardData(updatedPublication),
    [updatedPublication],
  )

  return (
    <PostCard
      contentRender={() => (
        <LensPostCardContent publication={updatedPublication as Post} />
      )}
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
