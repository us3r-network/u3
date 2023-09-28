import {
  Post,
  ProfileOwnedByMe,
  useActiveProfile,
  useFollow,
  useUnfollow,
  Profile,
} from '@lens-protocol/react-web';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import PostCard, { PostCardData } from '../PostCard';
import { lensPublicationToPostCardData } from '../../../utils/lens-ui-utils';
import { useCreateLensComment } from '../../../hooks/lens/useCreateLensComment';
import { useReactionLensUpvote } from '../../../hooks/lens/useReactionLensUpvote';
import { useCreateLensMirror } from '../../../hooks/lens/useCreateLensMirror';
import LensPostCardContent from './LensPostCardContent';
import { useLensCtx } from '../../../contexts/AppLensCtx';
import { LensPost } from '../../../api/lens';
import useLogin from '../../../hooks/useLogin';
import { getSocialDetailShareUrlWithLens } from '../../../utils/share';
import { tweetShare } from '../../../utils/twitter';

export default function LensPostDetailCard({ data }: { data: LensPost }) {
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
    hasUpvote,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication,
  });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication,
  });

  const [updatedPublication, setUpdatedPublication] = useState<Post | null>(
    null
  );

  useEffect(() => {
    setUpdatedPublication(publication);
    console.log({ publication });
  }, [publication]);

  useCreateLensComment({
    onCommentSuccess: (commentArgs) => {
      if (commentArgs.publicationId !== publication.id) return;

      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { stats } = prev;
        console.log({ stats });
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

  const cardData = useMemo<PostCardData>(
    () => lensPublicationToPostCardData(updatedPublication),
    [updatedPublication]
  );

  const replyDisabled = useMemo(
    () => isLogin && !publication?.canComment?.result,
    [isLogin, publication]
  );
  const repostDisabled = useMemo(
    () => isLogin && !publication?.canMirror?.result,
    [isLogin, publication]
  );

  const { data: lensActiveProfile } = useActiveProfile();
  const { execute: lensFollow, isPending: lensFollowIsPending } = useFollow({
    followee: (data.profile || { id: '' }) as Profile,
    follower: (lensActiveProfile || { ownedBy: '' }) as ProfileOwnedByMe,
  });
  const { execute: lensUnfollow, isPending: lensUnfollowPending } = useUnfollow(
    {
      followee: (data.profile || { id: '' }) as Profile,
      follower: (lensActiveProfile || { ownedBy: '' }) as ProfileOwnedByMe,
    }
  );
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
      liked={isLoginU3 && hasUpvote}
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
        if (!data?.canComment?.result) {
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
        if (!data?.canMirror?.result) {
          toast.error('No mirror permission');
          return;
        }
        createMirror();
      }}
      showMenuBtn
      isFollowed={data.profile?.followStatus?.isFollowedByMe}
      followPending={lensFollowIsPending}
      unfollowPending={lensUnfollowPending}
      followAction={() => {
        if (!isLoginU3) {
          loginU3();
          return;
        }
        if (!isLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (lensFollowIsPending || lensUnfollowPending) {
          return;
        }
        if (data.profile?.followStatus?.isFollowedByMe) {
          lensUnfollow()
            .then(() => {
              toast.success('Unfollow success');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Unfollow failed');
            });
        } else {
          lensFollow()
            .then(() => {
              toast.success('Follow success');
            })
            .catch((err) => {
              console.error(err);
              toast.error('Follow failed');
            });
        }
      }}
      shareAction={() => {
        tweetShare(
          data.metadata.content,
          getSocialDetailShareUrlWithLens(data.id)
        );
      }}
      copyAction={async () => {
        await window.navigator.clipboard.writeText(
          getSocialDetailShareUrlWithLens(data.id)
        );
        toast.success('Copy success');
      }}
    />
  );
}
