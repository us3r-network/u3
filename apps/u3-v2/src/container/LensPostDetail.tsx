import { useNavigate, useParams } from 'react-router-dom'
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
import ButtonBase from '../components/common/button/ButtonBase'
import BackIcon from '../components/common/icons/BackIcon'
import { useEffect, useState } from 'react'
import { useCreateLensComment } from '../hooks/lens/useCreateLensComment'
import LensReplyCard from '../components/lens/LensReplyCard'
import LensPostDetailCard from '../components/lens/LensPostDetailCard'
import ReplyCard from '../components/common/ReplyCard'

export default function LensPostDetail() {
  const navigate = useNavigate()
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
    return <div>Loading ...</div>
  }

  if (publication) {
    return (
      <>
        <BackBtn onClick={() => navigate(-1)} />
        <PostDetailWrapper>
          <LensPostDetailCard data={publication} />
          <LensCommentPostForm
            publicationId={publication.id}
            canComment={!!publication?.canComment?.result}
          />
          {createdComments && createdComments?.length > 0 && (
            <CommentsWrapper>
              {createdComments.map((comment, i) => {
                return (
                  <ReplyCard
                    data={{
                      avatar: (activeProfile?.picture as any)?.original?.url,
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
            </CommentsWrapper>
          )}
          {comments && comments?.length > 0 && (
            <CommentsWrapper>
              {comments.map((comment) => {
                return <LensReplyCard data={comment} key={comment.id} />
              })}
            </CommentsWrapper>
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
const BackBtn = styled(BackIcon)`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-bottom: 22px;
`
const PostDetailWrapper = styled.div`
  border-radius: 20px;
  background: #212228;
  overflow: hidden;
`
const CommentsWrapper = styled.div`
  & > *:not(:first-child) {
    border-top: 1px solid #191a1f;
  }
`

const LoadMoreBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background: #212228;
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
