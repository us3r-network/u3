import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Profile, useFollow, useUnfollow } from '@lens-protocol/react-web';
import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { SocialButtonPrimary } from '../social/button/SocialButton';
import useFarcasterFollowAction from '../../hooks/social/farcaster/useFarcasterFollowAction';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { useXmtpClient } from '../../contexts/message/XmtpClientCtx';
import {
  canFollow,
  canUnfollow,
  getHandle,
  isFollowedByMe,
} from '../../utils/social/lens/profile';
import { useLensCtx } from '../../contexts/social/AppLensCtx';

interface ProfileFollowBtnProps extends StyledComponentPropsWithRef<'button'> {
  lensProfiles?: Profile[];
  fid?: number;
}
export default function ProfileFollowBtn({
  lensProfiles,
  fid,
  ...wrapperProps
}: ProfileFollowBtnProps) {
  const { setCanEnableXmtp } = useXmtpClient();
  useEffect(() => {
    setCanEnableXmtp(true);
  }, []);

  const { isLogin, sessionProfile } = useLensCtx();
  const { following: farcasterFollowings } = useFarcasterCtx();

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
  const lensCanFollowProfiles = useMemo(
    () =>
      isLogin && sessionProfile && lensProfiles
        ? lensProfiles.filter(
            (profile) =>
              canFollow(profile) &&
              // eslint-disable-next-line no-underscore-dangle
              profile?.followModule?.__typename !== 'FeeFollowModuleSettings'
          )
        : [],
    [lensProfiles, isLogin, sessionProfile]
  );
  const lensCanUnfollowProfiles = useMemo(
    () =>
      isLogin && sessionProfile && lensProfiles
        ? lensProfiles.filter(
            (profile) =>
              canUnfollow(profile) &&
              // eslint-disable-next-line no-underscore-dangle
              profile?.followModule?.__typename !== 'FeeFollowModuleSettings'
          )
        : [],
    [lensProfiles, isLogin, sessionProfile]
  );
  const lensProfilesIsAllFollowing = useMemo(
    () => lensCanUnfollowProfiles.every((profile) => isFollowedByMe(profile)),
    [lensCanUnfollowProfiles]
  );

  const lensProfilesFollow = useCallback(() => {
    lensCanFollowProfiles.forEach((profile) => {
      if (!isFollowedByMe(profile)) {
        lensFollow({ profile })
          .then(() => {
            toast.success(`[lens] @${getHandle(profile)} follow success!`);
          })
          .catch((error) => {
            toast.error(
              `[lens] @${getHandle(profile)} follow failed: ${error}`
            );
          });
      }
    });
  }, [lensCanFollowProfiles, lensFollow]);

  const lensProfilesUnfollow = useCallback(() => {
    lensCanUnfollowProfiles.forEach((profile) => {
      if (isFollowedByMe(profile)) {
        lensUnfollow({ profile })
          .then(() => {
            toast.success(`[lens] @${getHandle(profile)} unfollow success!`);
          })
          .catch((error) => {
            toast.error(
              `[lens] @${getHandle(profile)} unfollow failed: ${error}`
            );
          });
      }
    });
  }, [lensCanUnfollowProfiles, lensFollow]);

  const fcastIsFollowing = useMemo(
    () => farcasterFollowings.includes(String(fid)),
    [fid, farcasterFollowings]
  );

  const followAction = useCallback(() => {
    if (!lensProfilesIsAllFollowing && !lensFollowIsPending) {
      lensProfilesFollow();
    }

    if (fid && !fcastIsFollowing && !fcastFollowIsPending) {
      fcastFollow(fid);
    }
  }, [
    lensProfilesFollow,
    lensProfilesIsAllFollowing,
    lensFollowIsPending,
    fid,
    fcastFollow,
    fcastFollowIsPending,
    fcastIsFollowing,
  ]);

  const unfollowAction = useCallback(() => {
    if (!lensUnfollowIsPending) {
      lensProfilesUnfollow();
    }

    if (fid && fcastIsFollowing && !fcastFollowIsPending) {
      fcastUnfollow(fid);
    }
  }, [
    lensProfilesFollow,
    lensUnfollowIsPending,
    fid,
    fcastUnfollow,
    fcastFollowIsPending,
    fcastIsFollowing,
  ]);

  const enabledLensFollowAction = lensCanFollowProfiles.length > 0;
  const enabledFarcasterFollowAction = !!fid;
  // 是否follow了此人的所有平台账户
  const isFollowing =
    // lens和farcaster 都follow 过
    (lensProfilesIsAllFollowing && fcastIsFollowing) ||
    // 没有lens，有farcaster，并follow了farcaster
    (!enabledLensFollowAction && fid && fcastIsFollowing) ||
    // 没有farcaster，有lens，并follow了lens
    (!enabledFarcasterFollowAction &&
      enabledLensFollowAction &&
      lensProfilesIsAllFollowing);

  const followActionLoading =
    lensFollowIsPending || lensUnfollowIsPending || fcastFollowIsPending;

  return (
    <Wrapper
      onClick={() => (isFollowing ? unfollowAction() : followAction())}
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
  color: #000;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
