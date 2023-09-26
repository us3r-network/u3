import { Comment } from '@lens-protocol/react-web';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { lensPublicationToReplyCardData } from '../../../utils/lens-ui-utils';
import { useCreateLensComment } from '../../../hooks/lens/useCreateLensComment';
import ReplyCard, { ReplyCardData } from '../ReplyCard';
import { useReactionLensUpvote } from '../../../hooks/lens/useReactionLensUpvote';
import { useCreateLensMirror } from '../../../hooks/lens/useCreateLensMirror';
import LensPostCardContent from './LensPostCardContent';
import { useLensCtx } from '../../../contexts/AppLensCtx';
import useLogin from '../../../hooks/useLogin';

export default function LensReplyCard({ data }: { data: Comment }) {
  const { isLogin: isLoginU3 } = useLogin();

  const navigate = useNavigate();
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx();

  const {
    toggleReactionUpvote,
    hasUpvote,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication: data,
  });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication: data,
  });

  const [updatedPublication, setUpdatedPublication] = useState<Comment | null>(
    null
  );

  useEffect(() => {
    setUpdatedPublication(data);
  }, [data]);

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.publicationId !== data.id) return;
      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { stats } = prev;
        return {
          ...prev,
          stats: {
            ...stats,
            totalAmountOfComments: Number(stats.totalAmountOfComments) + 1,
          },
        };
      });
    },
  });

  const cardData = useMemo<ReplyCardData>(
    () => lensPublicationToReplyCardData(updatedPublication),
    [updatedPublication]
  );

  const replyDisabled = useMemo(
    () => isLogin && !data?.canComment?.result,
    [isLogin, data]
  );
  const repostDisabled = useMemo(
    () => isLogin && !data?.canMirror?.result,
    [isLogin, data]
  );
  return (
    <ReplyCard
      // eslint-disable-next-line react/no-unstable-nested-components
      contentRender={() => (
        <LensPostCardContent publication={updatedPublication} />
      )}
      onClick={() => {
        navigate(`/social/post-detail/lens/${data.id}`);
      }}
      data={cardData}
      replyDisabled={replyDisabled}
      repostDisabled={repostDisabled}
      liked={hasUpvote}
      liking={isPendingReactionUpvote}
      likeAction={() => {
        if (!isLoginU3 || !isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        toggleReactionUpvote();
      }}
      replying={false}
      replyAction={() => {
        if (!isLoginU3 || !isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (!data?.canComment?.result) {
          toast.error('No comment permission');
          return;
        }
        setCommentModalData(data);
        setOpenCommentModal(true);
      }}
      reposting={isPendingMirror}
      repostAction={() => {
        if (!isLoginU3 || !isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (!data?.canMirror?.result) {
          toast.error('No mirror permission');
          return;
        }
        createMirror();
      }}
    />
  );
}
