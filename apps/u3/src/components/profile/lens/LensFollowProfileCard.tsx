import { Profile, useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useMemo } from 'react';
import { StyledComponentPropsWithRef } from 'styled-components';
import FollowProfileCard from '../FollowProfileCard';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';
import { SocialPlatform } from '../../../services/social/types';
import getAvatar from '../../../utils/social/lens/getAvatar';
import {
  getBio,
  getHandle,
  getName,
  getOwnedByAddress,
  isFollowedByMe,
} from '../../../utils/social/lens/profile';

type LensFollowProfileCardProps = StyledComponentPropsWithRef<'div'> & {
  profile?: Profile;
  isFollowingCard?: boolean;
};
export default function LensFollowProfileCard({
  profile,
  isFollowingCard,
  ...wrapperProps
}: LensFollowProfileCardProps) {
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();

  const { execute: follow, loading: followLoading } = useFollow();
  const { execute: unfollow, loading: unfollowLoading } = useUnfollow();
  const viewData = useMemo(
    () => ({
      handle: getHandle(profile),
      address: getOwnedByAddress(profile),
      name: getName(profile) || profile?.id,
      avatar: getAvatar(profile),
      bio: getBio(profile),
      isFollowed:
        isFollowingCard && !isLoginLens ? true : isFollowedByMe(profile),
      platforms: [SocialPlatform.Lens],
    }),
    [profile, isFollowingCard, isLoginLens]
  );

  return (
    <FollowProfileCard
      data={viewData}
      followPending={followLoading}
      unfollowPending={unfollowLoading}
      followAction={() => {
        if (!isLoginLens) {
          setOpenLensLoginModal(true);
          return;
        }
        follow({ profile });
      }}
      unfollowAction={() => {
        if (!isLoginLens) {
          setOpenLensLoginModal(true);
          return;
        }
        unfollow({ profile });
      }}
      {...wrapperProps}
    />
  );
}
