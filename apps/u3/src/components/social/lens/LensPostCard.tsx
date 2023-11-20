import { Post, useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { lensPublicationToPostCardData } from '../../../utils/social/lens/lens-ui-utils';
import { useCreateLensComment } from '../../../hooks/social/lens/useCreateLensComment';
import { useReactionLensUpvote } from '../../../hooks/social/lens/useReactionLensUpvote';
import { useCreateLensMirror } from '../../../hooks/social/lens/useCreateLensMirror';
import LensPostCardContent from './LensPostCardContent';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import PostCard, { PostCardData } from '../PostCard';
import useLogin from '../../../hooks/shared/useLogin';
import { getSocialDetailShareUrlWithLens } from '../../../utils/shared/share';
import {
  backendPublicationToLensPublication,
  canComment,
  canMirror,
  hasUpvoted,
} from '../../../utils/social/lens/publication';
import { isFollowedByMe } from '../../../utils/social/lens/profile';

export default function LensPostCard({
  data,
  cardClickAction,
}: {
  data: Post;
  cardClickAction?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const navigate = useNavigate();
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx();

  const [updatedPublication, setUpdatedPublication] = useState<Post>(data);

  useEffect(() => {
    setUpdatedPublication(backendPublicationToLensPublication(data));
  }, [data]);

  const { toggleReactionUpvote, isPending: isPendingReactionUpvote } =
    useReactionLensUpvote({
      publication: updatedPublication,
      onReactionSuccess: ({ originPublication, hasUpvoted: upvoted }) => {
        if (originPublication?.id !== updatedPublication.id) return;
        setUpdatedPublication((prev) => {
          if (!prev) return prev;
          const { stats, operations } = prev;
          const { upvotes = 0 } = stats || {};
          return {
            ...prev,
            operations: {
              ...operations,
              hasUpvoted: upvoted,
            },
            stats: {
              ...stats,
              upvotes: upvoted ? upvotes + 1 : upvotes > 0 ? upvotes - 1 : 0,
            },
          };
        });
      },
    });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication: updatedPublication,
    onMirrorSuccess: (originPublication) => {
      if (originPublication?.id !== updatedPublication.id) return;
      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { stats } = prev;
        return {
          ...prev,
          stats: {
            ...stats,
            mirrors: Number(stats.mirrors) + 1,
          },
        };
      });
    },
  });

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.commentOn.id !== updatedPublication.id) return;
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
    () => isLogin && !canComment(updatedPublication),
    [isLogin, updatedPublication]
  );
  const repostDisabled = useMemo(
    () => isLogin && !canMirror(updatedPublication),
    [isLogin, updatedPublication]
  );
  const upvoted = useMemo(
    () => isLogin && hasUpvoted(updatedPublication),
    [isLogin, updatedPublication]
  );

  const { execute: follow, loading: followLoading } = useFollow();
  const { execute: unfollow, loading: unfollowLoading } = useUnfollow();
  const setIsFollowedByMe = useCallback(
    (followedByMe: boolean) => {
      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { by } = updatedPublication;
        const { operations } = by || {};
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const { isFollowedByMe } = operations || {};

        return {
          ...prev,
          by: {
            ...by,
            operations: {
              ...operations,
              isFollowedByMe: {
                ...isFollowedByMe,
                value: followedByMe,
              },
            },
          },
        };
      });
    },
    [updatedPublication]
  );
  return (
    <PostCard
      // eslint-disable-next-line react/no-unstable-nested-components
      contentRender={() => (
        <LensPostCardContent publication={updatedPublication} />
      )}
      id={updatedPublication.id}
      onClick={(e) => {
        cardClickAction?.(e);
        navigate(`/social/post-detail/lens/${updatedPublication.id}`);
      }}
      data={cardData}
      replyDisabled={replyDisabled}
      repostDisabled={repostDisabled}
      liked={isLoginU3 && upvoted}
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
              setIsFollowedByMe(false);
              toast.success('Unfollow success');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Unfollow failed');
            });
        } else {
          follow({ profile: updatedPublication.by })
            .then((res) => {
              setIsFollowedByMe(true);
              toast.success('Follow success');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Follow failed');
            });
        }
      }}
      shareLink={getSocialDetailShareUrlWithLens(updatedPublication.id)}
      shareLinkEmbedTitle={
        (data?.metadata as any)?.title || (data?.metadata as any)?.content
      }
    />
  );
}
