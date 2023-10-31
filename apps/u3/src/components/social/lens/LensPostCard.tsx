import {
  Post,
  ProfileOwnedByMe,
  useActiveProfile,
  useFollow,
  useUnfollow,
  useProfilesOwnedBy,
  Profile,
} from '@lens-protocol/react-web';
import { useEffect, useMemo, useState } from 'react';
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
import { tweetShare } from '../../../utils/shared/twitter';
import { SOCIAL_SHARE_TITLE } from '../../../constants';

export default function LensPostCard({ data }: { data: Post }) {
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const navigate = useNavigate();
  const {
    isLogin,
    setOpenLensLoginModal,
    setCommentModalData,
    setOpenCommentModal,
  } = useLensCtx();

  const publication = data;

  const [updatedPublication, setUpdatedPublication] = useState<Post | null>(
    null
  );

  useEffect(() => {
    setUpdatedPublication(publication);
  }, [publication]);

  const {
    toggleReactionUpvote,
    hasUpvote,
    isPending: isPendingReactionUpvote,
  } = useReactionLensUpvote({
    publication,
    onReactionSuccess: ({ originPublication }) => {
      if (originPublication?.id !== data.id) return;
      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { stats } = prev;
        return {
          ...prev,
          stats: {
            ...stats,
            totalUpvotes: Number(stats.totalUpvotes) + 1,
          },
        };
      });
    },
  });

  const { createMirror, isPending: isPendingMirror } = useCreateLensMirror({
    publication,
    onMirrorSuccess: (originPublication) => {
      if (originPublication?.id !== data.id) return;
      setUpdatedPublication((prev) => {
        if (!prev) return prev;
        const { stats } = prev;
        return {
          ...prev,
          stats: {
            ...stats,
            totalAmountOfMirrors: Number(stats.totalAmountOfMirrors) + 1,
          },
        };
      });
    },
  });

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

  const { data: lensProfiles } = useProfilesOwnedBy({
    address: publication?.profile?.ownedBy || '',
  });
  const lensProfileFirst = lensProfiles?.[0];
  const { data: lensActiveProfile } = useActiveProfile();
  const { execute: lensFollow, isPending: lensFollowIsPending } = useFollow({
    followee: (lensProfileFirst || { id: '' }) as Profile,
    follower: (lensActiveProfile || { ownedBy: '' }) as ProfileOwnedByMe,
  });
  const { execute: lensUnfollow, isPending: lensUnfollowPending } = useUnfollow(
    {
      followee: (lensProfileFirst || { id: '' }) as Profile,
      follower: (lensActiveProfile || { ownedBy: '' }) as ProfileOwnedByMe,
    }
  );
  return (
    <PostCard
      // eslint-disable-next-line react/no-unstable-nested-components
      contentRender={() => <LensPostCardContent publication={publication} />}
      onClick={() => {
        navigate(`/social/post-detail/lens/${data.id}`);
      }}
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
      isFollowed={lensProfileFirst?.followStatus?.isFollowedByMe}
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
        if (lensProfileFirst?.followStatus?.isFollowedByMe) {
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
          SOCIAL_SHARE_TITLE,
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
