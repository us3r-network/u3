import { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Profile as LensProfile } from '@lens-protocol/react-web';
import { useParams, useSearchParams } from 'react-router-dom';
import KeepAlive from 'react-activation';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';
import ProfilePageNav, {
  FeedsType,
} from '../../components/profile/ProfilePageNav';
import UserWalletsStyled from '../../components/profile/UserWalletsStyled';
import UserTagsStyled from '../../components/profile/UserTagsStyled';
import { LogoutButton } from '../../components/layout/LoginButton';
import useLogin from '../../hooks/shared/useLogin';
import LogoutConfirmModal from '../../components/layout/LogoutConfirmModal';
import ProfileInfoCard from '../../components/profile/profile-info/ProfileInfoCard';
import { RouteKey } from '../../route/routes';
import {
  selectWebsite,
  setProfilePageFeedsType,
} from '../../features/shared/websiteSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import ProfilePageFollowNav, {
  FollowType,
} from '../../components/profile/ProfilePageFollowNav';
import LensProfileFollowing from '../../components/profile/lens/LensProfileFollowing';
import LensProfileFollowers from '../../components/profile/lens/LensProfileFollowers';
import { SocialPlatform } from '../../services/social/types';
import useFarcasterFollowNum from '../../hooks/social/farcaster/useFarcasterFollowNum';
import FarcasterFollowing from '../../components/profile/farcaster/FarcasterFollowing';
import FarcasterFollowers from '../../components/profile/farcaster/FarcasterFollowers';
import { isDidPkh } from '../../utils/shared/did';
import {
  ProfileSocialActivity,
  ProfileSocialPosts,
} from '../../components/profile/ProfileSocial';
import Loading from '../../components/common/loading/Loading';
import useDid from '../../hooks/profile/useDid';
import FollowingDefault from '../../components/social/FollowingDefault';
import { ProfileFeedsGroups } from '../../services/social/api/feeds';
import useU3ProfileInfoData from '../../hooks/profile/useU3ProfileInfoData';
import usePlatformProfileInfoData from '../../hooks/profile/usePlatformProfileInfoData';

export default function Profile() {
  const { user: identity } = useParams();
  const { did, loading: didLoading } = useDid(identity);
  const { getProfileWithDid } = useProfileState();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasProfileLoading, setHasProfileLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (isDidPkh(did)) {
        setHasProfileLoading(true);
        const profile = await getProfileWithDid(did);
        if (profile) {
          setHasProfile(true);
        }
        setHasProfileLoading(false);
      } else {
        setHasProfile(false);
      }
    })();
  }, [did]);

  const session = useSession();

  if (!identity) {
    return <U3ProfileContainer did={session?.id} />;
  }
  if (didLoading || hasProfileLoading) {
    return null;
  }
  if (isDidPkh(did) && hasProfile) {
    return <U3ProfileContainer did={did} />;
  }
  if (identity) {
    return <PlatformProfileContainer identity={identity} />;
  }
  return null;
}

function U3ProfileContainer({ did }: { did: string }) {
  const session = useSession();
  const { fid, address, lensProfileFirst, loading } = useU3ProfileInfoData({
    did,
  });
  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  return (
    <ProfileView
      fid={fid}
      lensProfileFirst={lensProfileFirst}
      address={address}
      did={did}
      identity=""
      isLoginUser={did === session?.id}
    />
  );
}
function PlatformProfileContainer({ identity }: { identity: string }) {
  const { fid, recommendAddress, lensProfileFirst, loading } =
    usePlatformProfileInfoData({ identity });
  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }
  return (
    <ProfileView
      fid={fid}
      lensProfileFirst={lensProfileFirst}
      address={recommendAddress}
      did=""
      identity={identity}
      isLoginUser={false}
    />
  );
}

type ProfileViewProps = {
  fid: string;
  lensProfileFirst: LensProfile;
  address: string;
  did: string;
  identity: string;
  isLoginUser: boolean;
};
function ProfileView({
  fid,
  lensProfileFirst,
  address,
  did,
  identity,
  isLoginUser,
}: ProfileViewProps) {
  const [searchParams] = useSearchParams();
  const currSearchParams = useMemo(
    () => ({
      followType: searchParams.get('followType') || '',
    }),
    [searchParams]
  );
  const { followType } = currSearchParams;

  const { logout } = useLogin();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  const { profilePageFeedsType } = useAppSelector(selectWebsite);
  const dispatch = useAppDispatch();

  const [followNavData, setFollowNavData] = useState({
    showFollowNav: false,
    followNavType: FollowType.FOLLOWING,
    followingActivePlatform: SocialPlatform.Farcaster,
    followersActivePlatform: SocialPlatform.Farcaster,
    followingPlatformCount: {
      [SocialPlatform.Lens]: 0,
      [SocialPlatform.Farcaster]: 0,
    },
    followersPlatformCount: {
      [SocialPlatform.Lens]: 0,
      [SocialPlatform.Farcaster]: 0,
    },
  });
  const {
    showFollowNav,
    followNavType,
    followingActivePlatform,
    followersActivePlatform,
    followingPlatformCount,
    followersPlatformCount,
  } = followNavData;

  const { farcasterFollowData } = useFarcasterFollowNum(fid);

  useEffect(() => {
    setFollowNavData((prevData) => ({
      ...prevData,
      followingPlatformCount: {
        [SocialPlatform.Lens]: lensProfileFirst?.stats.totalFollowing || 0,
        [SocialPlatform.Farcaster]: farcasterFollowData.following,
      },
      followersPlatformCount: {
        [SocialPlatform.Lens]: lensProfileFirst?.stats.totalFollowers || 0,
        [SocialPlatform.Farcaster]: farcasterFollowData.followers,
      },
    }));
  }, [lensProfileFirst, farcasterFollowData]);

  useEffect(() => {
    if (followType) {
      setFollowNavData((prevData) => ({
        ...prevData,
        showFollowNav: true,
        followNavType: followType as FollowType,
      }));
    }
  }, [followType]);

  useEffect(() => {
    setFollowNavData((prevData) => ({
      ...prevData,
      showFollowNav: false,
    }));
  }, [identity]);

  const onlyShowActivities = useMemo(
    () => !isLoginUser && !lensProfileFirst?.id && !fid,
    [isLoginUser, lensProfileFirst, fid]
  );

  return (
    <ProfileWrapper id="profile-wrapper">
      {isMobile && (
        <ProfileInfoMobileWrapper>
          <ProfileInfoMobile did={did} identity={identity} />
          <LogoutButton
            className="logout-button"
            onClick={() => {
              setOpenLogoutConfirm(true);
            }}
          />
        </ProfileInfoMobileWrapper>
      )}
      {(() => {
        if (showFollowNav) {
          if (followNavType === FollowType.FOLLOWING) {
            return (
              <ProfilePageFollowNav
                followType={FollowType.FOLLOWING}
                activePlatform={followingActivePlatform}
                platformCount={followingPlatformCount}
                onChangePlatform={(platform) => {
                  setFollowNavData((prevData) => ({
                    ...prevData,
                    followingActivePlatform: platform,
                  }));
                }}
                goBack={() => {
                  setFollowNavData((prevData) => ({
                    ...prevData,
                    showFollowNav: false,
                  }));
                }}
              />
            );
          }
          if (followNavType === FollowType.FOLLOWERS) {
            return (
              <ProfilePageFollowNav
                followType={FollowType.FOLLOWERS}
                activePlatform={followersActivePlatform}
                platformCount={followersPlatformCount}
                onChangePlatform={(platform) => {
                  setFollowNavData((prevData) => ({
                    ...prevData,
                    followersActivePlatform: platform,
                  }));
                }}
                goBack={() => {
                  setFollowNavData((prevData) => ({
                    ...prevData,
                    showFollowNav: false,
                  }));
                }}
              />
            );
          }
          return null;
        }

        return (
          <ProfilePageNav
            feedsType={
              onlyShowActivities && address
                ? FeedsType.ACTIVITIES
                : profilePageFeedsType
            }
            enabledFeedsTypes={
              onlyShowActivities
                ? address
                  ? [FeedsType.ACTIVITIES]
                  : []
                : undefined
            }
            onChangeFeedsType={(type) => {
              dispatch(setProfilePageFeedsType(type));
            }}
          />
        );
      })()}

      <MainWrapper>
        {!isMobile && (
          <MainLeft>
            <ProfileInfo
              did={did}
              identity={identity}
              clickFollowing={() => {
                setFollowNavData((prevData) => ({
                  ...prevData,
                  showFollowNav: true,
                  followNavType: FollowType.FOLLOWING,
                }));
              }}
              clickFollowers={() => {
                setFollowNavData((prevData) => ({
                  ...prevData,
                  showFollowNav: true,
                  followNavType: FollowType.FOLLOWERS,
                }));
              }}
            />
            {isLoginUser && (
              <>
                <LogoutButton
                  className="logout-button"
                  onClick={() => {
                    setOpenLogoutConfirm(true);
                  }}
                />
                <LogoutConfirmModal
                  isOpen={openLogoutConfirm}
                  onClose={() => {
                    setOpenLogoutConfirm(false);
                  }}
                  onConfirm={() => {
                    logout();
                    setOpenLogoutConfirm(false);
                  }}
                />
              </>
            )}
          </MainLeft>
        )}

        {(() => {
          if (showFollowNav) {
            if (
              followNavType === FollowType.FOLLOWING &&
              followingActivePlatform === SocialPlatform.Lens
            ) {
              return <LensProfileFollowing address={address} />;
            }
            if (
              followNavType === FollowType.FOLLOWERS &&
              followersActivePlatform === SocialPlatform.Lens
            ) {
              return <LensProfileFollowers address={address} />;
            }
            if (
              followNavType === FollowType.FOLLOWING &&
              followingActivePlatform === SocialPlatform.Farcaster
            ) {
              return <FarcasterFollowing fid={fid} />;
            }
            if (
              followNavType === FollowType.FOLLOWERS &&
              followersActivePlatform === SocialPlatform.Farcaster
            ) {
              return <FarcasterFollowers fid={fid} />;
            }
            return null;
          }
          if (
            address &&
            (onlyShowActivities ||
              profilePageFeedsType === FeedsType.ACTIVITIES)
          ) {
            return (
              <MainCenter>
                <ProfileSocialActivity address={address} />
              </MainCenter>
            );
          }

          if (isLoginUser && !lensProfileFirst?.id && !fid) {
            return (
              <MainCenter>
                <FollowingDefault />
              </MainCenter>
            );
          }
          return (
            <KeepAlive
              cacheKey={`${RouteKey.profile}_social_${
                lensProfileFirst?.id || '0'
              }_${fid || '0'}_${profilePageFeedsType}`}
              saveScrollPosition="#profile-wrapper"
            >
              <MainCenter>
                <ProfileSocialPosts
                  lensProfileId={lensProfileFirst?.id}
                  fid={fid}
                  group={profilePageFeedsType as unknown as ProfileFeedsGroups}
                />
              </MainCenter>
            </KeepAlive>
          );
        })()}

        {!isMobile && <MainRight />}
      </MainWrapper>
    </ProfileWrapper>
  );
}

function ProfileInfo({
  clickFollowing,
  clickFollowers,
  did,
  identity,
  ...props
}: StyledComponentPropsWithRef<'div'> & {
  clickFollowing?: () => void;
  clickFollowers?: () => void;
  did: string;
  identity: string;
}) {
  return (
    <ProfileInfoWrap {...props}>
      <ProfileInfoCard
        identity={identity || did}
        clickFollowing={clickFollowing}
        clickFollowers={clickFollowers}
      />
      <UserWalletsStyled did={did} />
      <UserTagsStyled did={did} />
    </ProfileInfoWrap>
  );
}
const ProfileInfoWrap = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
    width: 100%;
  }
`;

const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
  padding: 24px;
  margin-bottom: 20px;
  ${isMobile &&
  `
  height: 100vh;
  padding: 10px;
  padding-bottom: 60px;
  `}
`;
const ProfileInfoMobileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;
const ProfileInfoMobile = styled(ProfileInfo)`
  width: 100%;
`;
const MainWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 40px;
`;
const MainLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
`;
const MainRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: fit-content;
`;
const MainCenter = styled.div`
  width: 600px;
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
