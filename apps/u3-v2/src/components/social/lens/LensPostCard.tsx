import { LensPublication } from '../../../api/lens'
import { Post } from '@lens-protocol/react-web'
import { useLensCtx } from '../../../contexts/AppLensCtx'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import PostCard, { PostCardData } from '../PostCard'
import { useNavigate } from 'react-router-dom'
import { lensPublicationToPostCardData } from '../../../utils/lens-ui-utils'
import { useCreateLensComment } from '../../../hooks/lens/useCreateLensComment'
import { useReactionLensUpvote } from '../../../hooks/lens/useReactionLensUpvote'
import { useCreateLensMirror } from '../../../hooks/lens/useCreateLensMirror'
import LensPostCardContent from './LensPostCardContent'

export default function LensPostCard ({ data }: { data: LensPublication }) {
  const navigate = useNavigate()
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal
  } = useLensCtx()

  const publication = data as unknown as Post

  const [updatedPublication, setUpdatedPublication] = useState<Post | null>(
    null
  )

  useEffect(() => {
    setUpdatedPublication(publication)
  }, [publication])

  const {
    toggleReactionUpvote,
    hasUpvote,
    isPending: isPendingReactionUpvote
  } = useReactionLensUpvote({
    publication,
    onReactionSuccess: ({ originPublication, hasUpvote }) => {
      if (originPublication?.id !== data.id) return
      setUpdatedPublication(prev => {
        if (!prev) return prev
        const stats = prev.stats
        return {
          ...prev,
          stats: {
            ...stats,
            totalUpvotes: stats.totalUpvotes + 1
          }
        }
      })
    }
  })

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication,
    onMirrorSuccess: originPublication => {
      if (originPublication?.id !== data.id) return
      setUpdatedPublication(prev => {
        if (!prev) return prev
        const stats = prev.stats
        return {
          ...prev,
          stats: {
            ...stats,
            totalAmountOfMirrors: stats.totalAmountOfMirrors + 1
          }
        }
      })
    }
  })

  useCreateLensComment({
    onCommentSuccess: commentArgs => {
      if (commentArgs.publicationId !== data.id) return
      setUpdatedPublication(prev => {
        if (!prev) return prev
        const stats = prev.stats
        return {
          ...prev,
          stats: {
            ...stats,
            totalAmountOfComments: stats.totalAmountOfComments + 1
          }
        }
      })
    }
  })

  const cardData = useMemo<PostCardData>(
    () => lensPublicationToPostCardData(updatedPublication),
    [updatedPublication]
  )

  return (
    <PostCard
      contentRender={() => <LensPostCardContent publication={publication} />}
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
