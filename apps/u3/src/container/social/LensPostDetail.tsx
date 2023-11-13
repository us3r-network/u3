import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  usePublication,
  publicationId,
  usePublications,
  PublicationType,
  Comment,
  PrimaryPublication,
  LimitType,
  Post,
} from '@lens-protocol/react-web';
import { isMobile } from 'react-device-detect';

import LensCommentPostForm from '../../components/social/lens/LensCommentPostForm';
import { useCreateLensComment } from '../../hooks/social/lens/useCreateLensComment';
import LensReplyCard from '../../components/social/lens/LensReplyCard';
import LensPostDetailCard from '../../components/social/lens/LensPostDetailCard';
import ReplyCard from '../../components/social/ReplyCard';
import {
  LoadMoreBtn,
  PostDetailCommentsWrapper,
  PostDetailWrapper,
} from '../../components/social/PostDetail';
import Loading from '../../components/common/loading/Loading';
import getAvatar from '../../utils/social/lens/getAvatar';
import { scrollToAnchor } from '../../utils/shared/scrollToAnchor';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import { getHandle, getName } from '../../utils/social/lens/profile';
import { canComment } from '../../utils/social/lens/operations';

export default function LensPostDetail() {
  const { publicationId: pid } = useParams();

  const { sessionProfile } = useLensCtx();

  const { data: anyPublication, loading } = usePublication({
    forId: publicationId(pid),
  });
  const publication = anyPublication as PrimaryPublication;

  const {
    data: commentPublications,
    loading: commentsLoading,
    hasMore: hasMoreComments,
    next: loadMoreComments,
  } = usePublications({
    where: {
      publicationTypes: [PublicationType.Comment],
      publicationIds: [publicationId(pid)],
    },
    limit: LimitType.Fifty,
  });
  const comments = commentPublications as Comment[];

  const [createdComments, setCreatedComments] = useState<Comment[]>([]);

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.commentOn.id !== publication?.id) return;
      setCreatedComments((prev) => [
        commentArgs as unknown as Comment,
        ...prev,
      ]);
    },
  });

  useEffect(() => {
    setCreatedComments([]);
  }, [pid]);

  if (loading) {
    return (
      <LoadingWrapper isMobile={isMobile}>
        <Loading />
      </LoadingWrapper>
    );
  }

  if (publication) {
    scrollToAnchor(window.location.hash.split('#')[1]);
    return (
      <PostDetailWrapper isMobile={isMobile}>
        <LensPostDetailCard data={publication as Post} />
        <LensCommentPostForm
          publicationId={publication.id}
          canComment={canComment(publication)}
        />
        {createdComments && createdComments?.length > 0 && (
          <PostDetailCommentsWrapper>
            {createdComments.map((comment, i) => {
              return (
                <ReplyCard
                  data={{
                    avatar: getAvatar(sessionProfile),
                    name: getName(sessionProfile),
                    handle: getHandle(sessionProfile),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    createdAt: new Date() as any,
                    content: (comment?.metadata as any)?.content,
                  }}
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  showActions={false}
                />
              );
            })}
          </PostDetailCommentsWrapper>
        )}
        {comments && comments?.length > 0 && (
          <PostDetailCommentsWrapper>
            {comments.map((comment) => {
              return <LensReplyCard data={comment} key={comment.id} />;
            })}
          </PostDetailCommentsWrapper>
        )}

        {!loading && hasMoreComments && (
          <p>
            <LoadMoreBtn
              onClick={() => {
                if (commentsLoading) return;
                loadMoreComments();
              }}
            >
              {commentsLoading ? 'Loading ...' : 'Load more'}
            </LoadMoreBtn>
          </p>
        )}
      </PostDetailWrapper>
    );
  }
  return null;
}

const LoadingWrapper = styled.div<{ isMobile: boolean }>`
  width: ${(props) => (props.isMobile ? '100%' : '600px')};
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
