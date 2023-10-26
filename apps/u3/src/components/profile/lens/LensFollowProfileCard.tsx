import {
  Profile,
  ProfileOwnedByMe,
  useActiveProfile,
  useFollow,
  useUnfollow,
} from '@lens-protocol/react-web';
import { useMemo } from 'react';
import { StyledComponentPropsWithRef } from 'styled-components';
import FollowProfileCard from '../FollowProfileCard';
import { useLensCtx } from '../../../contexts/AppLensCtx';
import { SocailPlatform } from '../../../api';
import getAvatar from '../../../utils/lens/getAvatar';

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
  const { data: lensActiveProfile } = useActiveProfile();
  const { execute: lensFollow, isPending: lensFollowIsPending } = useFollow({
    followee: profile,
    follower: (lensActiveProfile || { ownedBy: '' }) as ProfileOwnedByMe,
  });
  const { execute: lensUnfollow, isPending: lensUnfollowPending } = useUnfollow(
    {
      followee: profile,
      follower: (lensActiveProfile || { ownedBy: '' }) as ProfileOwnedByMe,
    }
  );
  const viewData = useMemo(
    () => ({
      handle: profile.handle,
      address: profile.ownedBy,
      name: profile.name,
      avatar: getAvatar(profile),
      bio: profile.bio,
      isFollowed:
        isFollowingCard && !isLoginLens ? true : profile.isFollowedByMe,
      platforms: [SocailPlatform.Lens],
    }),
    [profile, isFollowingCard, isLoginLens]
  );

  return (
    <FollowProfileCard
      data={viewData}
      followPending={lensFollowIsPending}
      unfollowPending={lensUnfollowPending}
      followAction={() => {
        if (!isLoginLens) {
          setOpenLensLoginModal(true);
          return;
        }
        lensFollow();
      }}
      unfollowAction={() => {
        if (!isLoginLens) {
          setOpenLensLoginModal(true);
          return;
        }
        lensUnfollow();
      }}
      {...wrapperProps}
    />
  );
}
