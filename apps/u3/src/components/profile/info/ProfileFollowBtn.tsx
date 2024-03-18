import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Profile, useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { SocialButtonPrimary } from '../../social/button/SocialButton';
import useFarcasterFollowAction from '../../../hooks/social/farcaster/useFarcasterFollowAction';
import { useFarcasterCtx } from '../../../contexts/social/FarcasterCtx';
import {
  canFollow,
  canUnfollow,
  getHandle,
  isFollowedByMe,
} from '../../../utils/social/lens/profile';
import { useLensCtx } from '../../../contexts/social/AppLensCtx';

interface ProfileFollowBtnProps extends StyledComponentPropsWithRef<'button'> {
  lensProfiles?: Profile[];
  fid?: number;
}
export default function ProfileFollowBtn({
  lensProfiles,
  fid,
  ...wrapperProps
}: ProfileFollowBtnProps) {
  const { isLogin, sessionProfile, setOpenLensLoginModal } = useLensCtx();
  const {
    following: farcasterFollowings,
    isConnected: isLoginFarcaster,
    currFid: farcasterUserFid,
    openFarcasterQR,
  } = useFarcasterCtx();

  const { execute: lensFollow, loading: lensFollowIsPending } = useFollow();
  const { execute: lensUnfollow, loading: lensUnfollowIsPending } =
    useUnfollow();

  const {
    followAction: fcastFollow,
    unfollowAction: fcastUnfollow,
    isPending: fcastFollowIsPending,
  } = useFarcasterFollowAction();

  /**
   * TODO : __typename !== 'FeeFollowModuleSettings'
   * 这个是为了过滤掉需要付费才能Follow的lens 账户
   */
  const lensNotFeeFollowProfiles = useMemo(
    () =>
      lensProfiles?.filter(
        (profile) =>
          !profile?.followModule ||
          // eslint-disable-next-line no-underscore-dangle
          profile?.followModule?.__typename !== 'FeeFollowModuleSettings'
      ) || [],
    [lensProfiles]
  );
  const lensCanFollowProfiles = useMemo(
    () =>
      lensNotFeeFollowProfiles.filter(
        (profile) => canFollow(profile) && !isFollowedByMe(profile)
      ),
    [lensNotFeeFollowProfiles]
  );
  const lensProfilesFollow = useCallback(() => {
    lensCanFollowProfiles.forEach((profile) => {
      lensFollow({ profile })
        .then(() => {
          toast.success(`[lens] @${getHandle(profile)} follow success!`);
        })
        .catch((error) => {
          toast.error(`[lens] @${getHandle(profile)} follow failed: ${error}`);
        });
    });
  }, [lensCanFollowProfiles, lensFollow]);
  const lensCanUnfollowProfiles = useMemo(
    () =>
      lensNotFeeFollowProfiles.filter(
        (profile) => canUnfollow(profile) && isFollowedByMe(profile)
      ),
    [lensNotFeeFollowProfiles]
  );
  const lensProfilesUnfollow = useCallback(() => {
    lensCanUnfollowProfiles.forEach((profile) => {
      lensUnfollow({ profile })
        .then(() => {
          toast.success(`[lens] @${getHandle(profile)} unfollow success!`);
        })
        .catch((error) => {
          toast.error(
            `[lens] @${getHandle(profile)} unfollow failed: ${error}`
          );
        });
    });
  }, [lensCanUnfollowProfiles, lensFollow]);

  const lensProfilesIsAllFollowing = useMemo(
    () => lensCanFollowProfiles.length === 0,
    [lensCanFollowProfiles]
  );

  const fcastIsFollowing = useMemo(
    () => farcasterFollowings.includes(String(fid)),
    [fid, farcasterFollowings]
  );

  const followAction = useCallback(() => {
    lensProfilesFollow();

    if (fid) {
      fcastFollow(fid);
    }
  }, [lensProfilesFollow, fid, fcastFollow]);

  const unfollowAction = useCallback(() => {
    lensProfilesUnfollow();

    if (fid) {
      fcastUnfollow(fid);
    }
  }, [lensProfilesFollow, fid, fcastUnfollow]);

  const hasFarcaster = !!fid;
  const hasLens = lensNotFeeFollowProfiles.length > 0;
  const farcasterIsLogin = isLoginFarcaster && farcasterUserFid;
  const lensIsLogin = isLogin && sessionProfile;

  let isFollowing = false;
  if (hasFarcaster && hasLens) {
    isFollowing =
      farcasterIsLogin &&
      lensIsLogin &&
      fcastIsFollowing &&
      lensProfilesIsAllFollowing;
  } else if (hasFarcaster) {
    isFollowing = farcasterIsLogin && fcastIsFollowing;
  } else if (hasLens) {
    isFollowing = lensIsLogin && lensProfilesIsAllFollowing;
  }

  const followActionLoading =
    lensFollowIsPending || lensUnfollowIsPending || fcastFollowIsPending;

  return (
    <Wrapper
      onClick={() => {
        if (hasFarcaster && !farcasterIsLogin) {
          openFarcasterQR();
          return;
        }
        if (hasLens && !lensIsLogin) {
          setOpenLensLoginModal(true);
          return;
        }
        if (isFollowing) {
          unfollowAction();
        } else {
          followAction();
        }
      }}
      disabled={followActionLoading}
      {...wrapperProps}
    >
      {isFollowing
        ? followActionLoading
          ? 'Unfollow...'
          : 'Following'
        : followActionLoading
        ? 'Following...'
        : 'Follow'}
    </Wrapper>
  );
}

const Wrapper = styled(SocialButtonPrimary)`
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
