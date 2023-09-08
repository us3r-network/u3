import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  usePublication,
  publicationId,
  useComments,
  useActiveProfile,
  CreateCommentArgs,
} from '@lens-protocol/react-web';

import { LensPublication } from '../api/lens';
import LensCommentPostForm from '../components/social/lens/LensCommentPostForm';
import { useCreateLensComment } from '../hooks/lens/useCreateLensComment';
import LensReplyCard from '../components/social/lens/LensReplyCard';
import LensPostDetailCard from '../components/social/lens/LensPostDetailCard';
import ReplyCard from '../components/social/ReplyCard';
import GoBack from '../components/GoBack';
import {
  LoadMoreBtn,
  PostDetailCommentsWrapper,
  PostDetailWrapper,
} from '../components/social/PostDetail';
import Loading from '../components/common/loading/Loading';
import getAvatar from '../utils/lens/getAvatar';

export default function LensPostDetail() {
  const { publicationId: pid } = useParams();

  const { data: activeProfile } = useActiveProfile();

  const { data, loading } = usePublication({
    publicationId: publicationId(pid),
    observerId: activeProfile?.id,
  });

  const publication = { ...data } as unknown as LensPublication;

  const {
    data: comments,
    loading: commentsLoading,
    hasMore: hasMoreComments,
    next: loadMoreComments,
  } = useComments({
    commentsOf: publicationId(pid),
    limit: 50,
  });

  const [createdComments, setCreatedComments] = useState<CreateCommentArgs[]>(
    []
  );

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.publicationId !== data?.id) return;
      setCreatedComments((prev) => [commentArgs, ...prev]);
    },
  });

  useEffect(() => {
    setCreatedComments([]);
  }, [pid]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
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
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      createdAt: new Date() as any,
                      content: comment.content,
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
      </>
    );
  }
  return null;
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
