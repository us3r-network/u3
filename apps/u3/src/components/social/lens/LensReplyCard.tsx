import { Comment } from '@lens-protocol/react-web';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { lensPublicationToReplyCardData } from '../../../utils/social/lens/lens-ui-utils';
import { useCreateLensComment } from '../../../hooks/social/lens/useCreateLensComment';
import ReplyCard, { ReplyCardData } from '../ReplyCard';
import { useReactionLensUpvote } from '../../../hooks/social/lens/useReactionLensUpvote';
import { useCreateLensMirror } from '../../../hooks/social/lens/useCreateLensMirror';
import LensPostCardContent from './LensPostCardContent';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import useLogin from '../../../hooks/shared/useLogin';
import { canComment, canMirror } from '../../../utils/social/lens/operations';

export default function LensReplyCard({ data }: { data: Comment }) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();

  const navigate = useNavigate();
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx();

  const {
    toggleReactionUpvote,
    hasUpvoted,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication: data,
  });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication: data,
  });

  const [updatedPublication, setUpdatedPublication] = useState<Comment>(data);

  useEffect(() => {
    setUpdatedPublication(data);
  }, [data]);

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.commentOn.id !== data.id) return;
      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { stats } = prev;
        return {
          ...prev,
          stats: {
            ...stats,
            comments: Number(stats.comments) + 1,
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
    () => isLogin && !canComment(data),
    [isLogin, data]
  );
  const repostDisabled = useMemo(
    () => isLogin && !canMirror(data),
    [isLogin, data]
  );
  return (
    <ReplyCard
      id={updatedPublication?.id}
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
      liked={isLoginU3 && hasUpvoted}
      liking={isPendingReactionUpvote}
      likeAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (!isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        toggleReactionUpvote();
      }}
      replying={false}
      replyAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (!isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (!canComment(data)) {
          toast.error('No comment permission');
          return;
        }
        setCommentModalData(data);
        setOpenCommentModal(true);
      }}
      reposting={isPendingMirror}
      repostAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (!isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (!canMirror(data)) {
          toast.error('No mirror permission');
          return;
        }
        createMirror();
      }}
    />
  );
}
