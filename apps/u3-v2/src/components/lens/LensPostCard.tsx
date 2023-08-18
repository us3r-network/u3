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
import { useCallback, useMemo } from 'react'

export default function LensPostCard({ data }: { data: LensFeedPost }) {
  const { isLogin, lensLogin } = useLensAuth()
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

  const toggleReactionUpvote = useCallback(async () => {
    const hasReactionTypeUpvote = hasReaction({
      reactionType: ReactionType.UPVOTE,
      publication,
    })
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
  }, [publication, hasReaction, removeReaction, addReaction])

  return (
    <CastBox>
      <div key={data.id}>
        <div>
          <p>{data.profile.handle}: </p>
          {data.metadata.content}
        </div>
        <small>{dayjs(data.timestamp).format()}</small>
        <div>
          {/* <button>comment</button> */}
          <button
            onClick={() => {
              if (!isLogin) {
                lensLogin()
                return
              }
              toggleReactionUpvote()
            }}
          >
            {isPendingReaction
              ? 'liking...'
              : hasReaction({
                  reactionType: ReactionType.UPVOTE,
                  publication,
                })
              ? 'unlike'
              : 'like'}
          </button>
          <button
            onClick={() => {
              if (!isLogin) {
                lensLogin()
                return
              }
              createMirror({
                publication,
              })
            }}
          >
            {isPendingMirror ? 'mirroring...' : 'mirror'}
          </button>
        </div>
      </div>
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
