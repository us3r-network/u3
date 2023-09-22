import {
  Profile,
  useActiveProfile,
  useFollow,
  useUnfollow,
} from '@lens-protocol/react-web';
import FollowProfileCard, {
  FollowProfileCardProps,
} from '../FollowProfileCard';
import { useLensCtx } from '../../../contexts/AppLensCtx';

export default function LensFollowProfileCard({
  data,
  lensProfile,
  ...wrapperProps
}: FollowProfileCardProps & { lensProfile?: Profile }) {
  const { isLogin: isLoginLens, setOpenLensLoginModal } = useLensCtx();
  const { data: lensActiveProfile } = useActiveProfile();
  const { execute: lensFollow, isPending: lensFollowIsPending } = useFollow({
    followee: lensProfile || ({ id: '' } as Profile),
    follower: lensActiveProfile,
  });
  const { execute: lensUnfollow, isPending: lensUnfollowPending } = useUnfollow(
    {
      followee: lensProfile || ({ id: '' } as Profile),
      follower: lensActiveProfile,
    }
  );
  return (
    <FollowProfileCard
      data={data}
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
        lensUnfollow();
      }}
      {...wrapperProps}
    />
  );
}
