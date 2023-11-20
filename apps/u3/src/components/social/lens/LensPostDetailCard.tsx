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
  hasUpvoted,
} from '../../../utils/social/lens/publication';
import { isFollowedByMe } from '../../../utils/social/lens/profile';

export default function LensPostDetailCard({ data }: { data: Post }) {
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx();

  const { isLogin: isLoginU3, login: loginU3 } = useLogin();

  const [updatedPublication, setUpdatedPublication] = useState(data);

  useEffect(() => {
    setUpdatedPublication(data);
  }, [data]);

  const { toggleReactionUpvote, isPending: isPendingReactionUpvote } =
    useReactionLensUpvote({
      publication: updatedPublication,
      // 这里执行toggleReactionUpvote 后，官方usePublication() 钩子返回的数据会自动更新数据
      // onReactionSuccess: ({ originPublication, hasUpvoted: upvoted }) => {
      //   console.log('onReactionSuccess', {
      //     originPublication,
      //     hasUpvoted: upvoted,
      //   });

      //   if (originPublication?.id !== updatedPublication.id) return;
      //   setUpdatedPublication((prev) => {
      //     if (!prev) return prev;
      //     const { stats, operations } = prev;
      //     const { upvotes = 0 } = stats || {};
      //     return {
      //       ...prev,
      //       operations: {
      //         ...operations,
      //         hasUpvoted: upvoted,
      //       },
      //       stats: {
      //         ...stats,
      //         upvotes: upvoted ? upvotes + 1 : upvotes > 0 ? upvotes - 1 : 0,
      //       },
      //     };
      //   });
      // },
    });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication: updatedPublication,
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
