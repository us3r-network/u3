import { useParams } from 'react-router-dom'
import {
  usePublication,
  publicationId,
  useComments,
  useActiveProfile,
  CreateCommentArgs,
} from '@lens-protocol/react-web'
import { LensPublication } from '../api/lens'
import styled from 'styled-components'
import LensCommentPostForm from '../components/lens/LensCommentPostForm'
import { useEffect, useState } from 'react'
import { useCreateLensComment } from '../hooks/lens/useCreateLensComment'
import LensReplyCard from '../components/lens/LensReplyCard'
import LensPostDetailCard from '../components/lens/LensPostDetailCard'
import ReplyCard from '../components/common/ReplyCard'
import GoBack from '../components/GoBack'
import {
  LoadMoreBtn,
  PostDetailCommentsWrapper,
  PostDetailWrapper,
} from '../components/common/PostDetail'
import Loading from '../components/common/loading/Loading'
import getAvatar from '../utils/lens/getAvatar'

export default function LensPostDetail() {
  const { publicationId: pid } = useParams()

  const { data: activeProfile } = useActiveProfile()

  const { data, loading } = usePublication({
    publicationId: publicationId(pid as string),
    observerId: activeProfile?.id,
  })

  const publication = { ...data } as unknown as LensPublication

  const {
    data: comments,
    loading: commentsLoading,
    hasMore: hasMoreComments,
    next: loadMoreComments,
  } = useComments({
    commentsOf: publicationId(pid as string),
    limit: 50,
  })

  const [createdComments, setCreatedComments] = useState<CreateCommentArgs[]>(
    [],
  )

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.publicationId !== data?.id) return
      setCreatedComments((prev) => [commentArgs, ...prev])
    },
  })

  useEffect(() => {
    setCreatedComments([])
  }, [pid])

  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    )
  }

  if (publication) {
    return (
      <>
        <GoBack />
        <PostDetailWrapper>
          <LensPostDetailCard data={publication} />
          <LensCommentPostForm
            publicationId={publication.id}
            canComment={!!publication?.canComment?.result}
          />
          {createdComments && createdComments?.length > 0 && (
            <PostDetailCommentsWrapper>
              {createdComments.map((comment, i) => {
                return (
                  <ReplyCard
                    data={{
                      avatar: getAvatar(activeProfile),
                      name: activeProfile?.name || '',
                      handle: activeProfile?.handle || '',
                      createdAt: new Date() as any,
                      content: comment.content,
                    }}
                    key={i}
                    showActions={false}
                  />
                )
              })}
            </PostDetailCommentsWrapper>
          )}
          {comments && comments?.length > 0 && (
            <PostDetailCommentsWrapper>
              {comments.map((comment) => {
                return <LensReplyCard data={comment} key={comment.id} />
              })}
            </PostDetailCommentsWrapper>
          )}

          {!loading && hasMoreComments && (
            <p>
              <LoadMoreBtn
                onClick={() => {
                  if (commentsLoading) return
                  loadMoreComments()
                }}
              >
                {commentsLoading ? 'Loading ...' : 'Load more'}
              </LoadMoreBtn>
            </p>
          )}
        </PostDetailWrapper>
      </>
    )
  }
  return null
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
