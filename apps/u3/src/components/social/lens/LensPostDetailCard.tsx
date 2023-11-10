import { Post, useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PostCard, { PostCardData } from '../PostCard';
import { lensPublicationToPostCardData } from '../../../utils/social/lens/lens-ui-utils';
import { useCreateLensComment } from '../../../hooks/social/lens/useCreateLensComment';
import { useReactionLensUpvote } from '../../../hooks/social/lens/useReactionLensUpvote';
import { useCreateLensMirror } from '../../../hooks/social/lens/useCreateLensMirror';
import LensPostCardContent from './LensPostCardContent';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import useLogin from '../../../hooks/shared/useLogin';
import { getSocialDetailShareUrlWithLens } from '../../../utils/shared/share';
import {
  canComment,
  canMirror,
  isFollowedByMe,
} from '../../../utils/social/lens/operations';

export default function LensPostDetailCard({ data }: { data: Post }) {
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx();

  const { isLogin: isLoginU3, login: loginU3 } = useLogin();

  const publication = data as unknown as Post;

  const {
    toggleReactionUpvote,
    hasUpvoted,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication,
  });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication,
  });

  const [updatedPublication, setUpdatedPublication] = useState(publication);

  useEffect(() => {
    setUpdatedPublication(publication);
  }, [publication]);

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.commentOn.id !== publication.id) return;

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

  const cardData = useMemo<PostCardData>(
    () => lensPublicationToPostCardData(updatedPublication),
    [updatedPublication]
  );

  const replyDisabled = useMemo(
    () => isLogin && !canComment(publication),
    [isLogin, publication]
  );
  const repostDisabled = useMemo(
    () => isLogin && !canMirror(publication),
    [isLogin, publication]
  );

  const { execute: follow, loading: followLoading } = useFollow();
  const { execute: unfollow, loading: unfollowLoading } = useUnfollow();

  return (
    <PostCard
      isDetail
      // eslint-disable-next-line react/no-unstable-nested-components
      contentRender={() => (
        <LensPostCardContent publication={updatedPublication} isDetail />
      )}
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
      showMenuBtn
      isFollowed={isFollowedByMe(updatedPublication.by)}
      followPending={followLoading}
      unfollowPending={unfollowLoading}
      followAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (!isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (followLoading || unfollowLoading) {
          return;
        }
        if (isFollowedByMe(updatedPublication.by)) {
          unfollow({ profile: updatedPublication.by })
            .then(() => {
              toast.success('Unfollow success');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Unfollow failed');
            });
        } else {
          follow({ profile: updatedPublication.by })
            .then((res) => {
              toast.success('Follow success');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Follow failed');
            });
        }
      }}
      shareLink={getSocialDetailShareUrlWithLens(updatedPublication.id)}
    />
  );
}
