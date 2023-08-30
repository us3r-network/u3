import { LensPublication } from '../../api/lens'
import {
  Post,
  ProfileOwnedByMe,
  ReactionTypes,
  useActiveProfile,
  useCreateMirror,
  useReaction,
} from '@lens-protocol/react-web'
import { useLensCtx } from '../../contexts/AppLensCtx'
import { useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import PostCard, { PostCardData } from '../common/PostCard'
import { useNavigate } from 'react-router-dom'
import { lensPublicationToPostCardData } from '../../utils/lens-ui-utils'

export default function LensPostCard({ data }: { data: LensPublication }) {
  const navigate = useNavigate()
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx()
  const { data: activeProfile } = useActiveProfile()
  const publisher = activeProfile as ProfileOwnedByMe

  const publication = data as unknown as Post

  const { execute: createMirror, isPending: isPendingMirror } = useCreateMirror(
    { publisher },
  )

  const {
    addReaction,
    removeReaction,
    isPending: isPendingReaction,
  } = useReaction({
    profileId: publisher?.id,
  })

  const hasReactionTypeUpvote = useMemo(
    () => publication?.reaction === ReactionTypes.Upvote,
    [publication.reaction],
  )

  const toggleReactionUpvote = useCallback(async () => {
    try {
      if (hasReactionTypeUpvote) {
        await removeReaction({
          reactionType: ReactionTypes.Upvote,
          publication,
        })
      } else {
        await addReaction({
          reactionType: ReactionTypes.Upvote,
          publication,
        })
      }
      toast.success('Like successfully')
    } catch (error: any) {
      console.error(error?.message)
      toast.error('Like failed')
    }
  }, [publication, hasReactionTypeUpvote, removeReaction, addReaction])

  const createMirrorAction = useCallback(async () => {
    try {
      await createMirror({
        publication,
      })
      toast.success('Mirror successfully')
    } catch (error: any) {
      console.error(error?.message)
      toast.error('Mirror failed')
    }
  }, [createMirror, publication])

  const cardData = useMemo<PostCardData>(
    () => lensPublicationToPostCardData(data),
    [data],
  )

  return (
    <PostCard
      onClick={() => {
        navigate(`/post-detail/lens/${data.id}`)
      }}
      data={cardData}
      liked={hasReactionTypeUpvote}
      liking={isPendingReaction}
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
        createMirrorAction()
      }}
    />
  )
}
