import { Profile, useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { isFollowedByMe } from '../../../utils/social/lens/operations';

export default function useLensFollowActions() {
  const {
    execute: follow,
    error: followError,
    loading: followLoading,
  } = useFollow();
  const {
    execute: unfollow,
    error: unfollowError,
    loading: unfollowLoading,
  } = useUnfollow();

  const toggleFollow = useCallback(
    async (profile: Profile) => {
      if (followLoading || unfollowLoading) return;
      if (isFollowedByMe(profile)) {
        unfollow({ profile })
          .then(() => {
            toast.success('Unfollow success');
          })
          .catch((err) => {
            console.error(err);
            toast.error('Unfollow failed');
          });
      } else {
        follow({ profile })
          .then(() => {
            toast.success('Follow success');
          })
          .catch((err) => {
            console.error(err);
            toast.error('Follow failed');
          });
      }
    },
    [follow, unfollow, followLoading, unfollowLoading]
  );

  return {
    follow,
    followError,
    followLoading,
    unfollow,
    unfollowError,
    unfollowLoading,
    toggleFollow,
    toggleFollowError: unfollowError || followError,
    toggleFollowLoading: followLoading || unfollowLoading,
  };
}
