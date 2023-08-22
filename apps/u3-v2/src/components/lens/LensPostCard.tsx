import styled from 'styled-components'
import { LensFeedPost } from '../../api/lens'
import dayjs from 'dayjs'
import {
  Post,
  ProfileOwnedByMe,
  ReactionType,
  useActiveProfile,
  useCreateMirror,
  useReaction,
} from '@lens-protocol/react-web'
import { useLensAuth } from '../../contexts/AppLensCtx'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LensCommentPostModal from './LensCommentPostModal'
import { useGlobalModal } from '../../contexts/GlobalModalCtx'
import { toast } from 'react-toastify'

export default function LensPostCard({ data }: { data: LensFeedPost }) {
  const { isLogin } = useLensAuth()
  const { data: activeProfile } = useActiveProfile()
  const publisher = activeProfile as ProfileOwnedByMe

  const publication = useMemo(
    () => ({ __typename: 'Post', ...data }) as unknown as Post,
    [data],
  )

  const { execute: createMirror, isPending: isPendingMirror } = useCreateMirror(
    { publisher },
  )

  const {
    addReaction,
    removeReaction,
    hasReaction,
    isPending: isPendingReaction,
  } = useReaction({
    profileId: publisher?.id,
  })

  const [hasReactionTypeUpvote, setHasReactionTypeUpvote] = useState(false)

  // TODO: hasReaction could not update its status, pending resolution
  useEffect(() => {
    setHasReactionTypeUpvote(
      hasReaction({
        reactionType: ReactionType.UPVOTE,
        publication,
      }),
    )
  }, [hasReaction, publication])

  const toggleReactionUpvote = useCallback(async () => {
    try {
      if (hasReactionTypeUpvote) {
        await removeReaction({
          reactionType: ReactionType.UPVOTE,
          publication,
        })
      } else {
        await addReaction({
          reactionType: ReactionType.UPVOTE,
          publication,
        })
      }
      setHasReactionTypeUpvote(!hasReactionTypeUpvote)
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

  const [openCommentModal, setOpenCommentModal] = useState(false)

  const { setOpenLensLoginModal } = useGlobalModal()

  return (
    <CastBox>
      <div key={data.id}>
        <div>
          <p>{data.profile.handle}: </p>
          {data.metadata.content}
        </div>
        <small>{dayjs(data.timestamp).format()}</small>
        <div>
          <button
            onClick={() => {
              if (!isLogin) {
                setOpenLensLoginModal(true)
                return
              }
              setOpenCommentModal(true)
            }}
          >
            comment ({data.stats.totalAmountOfComments})
          </button>
          <button
            onClick={() => {
              if (!isLogin) {
                setOpenLensLoginModal(true)
                return
              }
              toggleReactionUpvote()
            }}
          >
            {isPendingReaction
              ? 'liking...'
              : hasReactionTypeUpvote
              ? 'unlike'
              : 'like'}
            ({data.stats.totalUpvotes})
          </button>
          <button
            onClick={() => {
              if (!isLogin) {
                setOpenLensLoginModal(true)
                return
              }
              createMirrorAction()
            }}
          >
            {isPendingMirror ? 'mirroring...' : 'mirror'}(
            {data.stats.totalAmountOfMirrors})
          </button>
        </div>
      </div>
      <LensCommentPostModal
        open={openCommentModal}
        closeModal={() => setOpenCommentModal(false)}
        publicationId={publication.id}
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
