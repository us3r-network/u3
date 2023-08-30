import { useNavigate, useParams } from 'react-router-dom'
import {
  usePublication,
  publicationId,
  useComments,
  useActiveProfile,
} from '@lens-protocol/react-web'
import { LensPublication } from '../api/lens'
import LensPostCard from '../components/lens/LensPostCard'
import styled from 'styled-components'
import LensCommentPostForm from '../components/lens/LensCommentPostForm'
import ReplyCard from '../components/common/ReplyCard'
import { SocailPlatform } from '../api'
import ButtonBase from '../components/common/button/ButtonBase'

export default function LensPostDetail() {
  const navigate = useNavigate()
  const { publicationId: pid } = useParams()

  const { data: activeLensProfile } = useActiveProfile()

  const { data, loading } = usePublication({
    publicationId: publicationId(pid as string),
    observerId: activeLensProfile?.id,
  })

  const publication = data as unknown as LensPublication

  const {
    data: comments,
    loading: commentsLoading,
    hasMore: hasMoreComments,
    next: loadMoreComments,
  } = useComments({
    commentsOf: publicationId(pid as string),
    limit: 50,
  })

  if (loading) {
    return <div>Loading ...</div>
  }

  if (publication) {
    return (
      <PostDetailWrapper>
        <LensPostCard data={publication} />
        <LensCommentPostForm
          publicationId={publication.id}
          canComment={!!publication?.canComment?.result}
        />
        {comments && comments?.length > 0 && (
          <CommentsWrapper>
            {comments.map((comment) => {
              const cardData = {
                platform: SocailPlatform.Lens,
                avatar: (comment.profile?.picture as any)?.original?.url,
                name: comment.profile?.name || '',
                handle: comment.profile?.handle,
                createdAt: comment.createdAt,
                content: comment.metadata?.content || '',
                totalLikes: comment.stats?.totalUpvotes,
                totalReplies: comment.stats?.totalAmountOfComments,
                totalReposts: comment.stats?.totalAmountOfMirrors,
                likesAvatar: [],
              }
              return (
                <ReplyCard
                  data={cardData}
                  key={comment.id}
                  onClick={() => navigate('/post-detail/lens/' + comment.id)}
                />
              )
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
    )
  }
  return null
}

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
