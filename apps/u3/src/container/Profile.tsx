import { useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import {
  Profile as LensProfile,
  useProfilesOwnedBy,
} from '@lens-protocol/react-web';
import { useParams } from 'react-router-dom';
import KeepAlive from 'react-activation';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useProfileState } from '@us3r-network/profile';
import ProfilePageNav from '../components/profile/ProfilePageNav';
import UserWalletsStyled from '../components/s3/profile/UserWalletsStyled';
import UserTagsStyled from '../components/s3/profile/UserTagsStyled';
import { LogoutButton } from '../components/layout/LoginButton';
import useLogin from '../hooks/useLogin';
import LogoutConfirmModal from '../components/layout/LogoutConfirmModal';
import ProfileInfoCard from '../components/profile/profile-info/ProfileInfoCard';
import { RouteKey } from '../route/routes';
import {
  selectWebsite,
  setProfilePageFeedsType,
} from '../features/website/websiteSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import ProfilePageFollowNav, {
  FollowType,
} from '../components/profile/ProfilePageFollowNav';
import LensProfileFollowing from '../components/profile/lens/LensProfileFollowing';
import LensProfileFollowers from '../components/profile/lens/LensProfileFollowers';
import { SocailPlatform } from '../api';
import useFarcasterFollowNum from '../hooks/farcaster/useFarcasterFollowNum';
import FarcasterFollowing from '../components/profile/farcaster/FarcasterFollowing';
import FarcasterFollowers from '../components/profile/farcaster/FarcasterFollowers';
import { getAddressWithDidPkh } from '../utils/did';
import ProfileSocial from '../components/profile/ProfileSocial';
import Loading from '../components/common/loading/Loading';
import useDid from '../hooks/useDid';
import useBioLinkListWithDid from '../hooks/useBioLinkListWithDid';
import { BIOLINK_PLATFORMS } from '../utils/profile/biolink';

export default function Profile() {
  const { user } = useParams();
  const session = useSession();

  const { did, loading: didLoading } = useDid(user);

  const isLoginUser = useMemo(
    () => !user || did === session?.id,
    [user, did, session]
  );

  const currProfileDid = useMemo(
    () => (user ? did : session?.id),
    [user, did, session]
  );

  const { logout } = useLogin();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  const { profilePageFeedsType } = useAppSelector(selectWebsite);
  const dispatch = useAppDispatch();

  const [followNavData, setFollowNavData] = useState({
    showFollowNav: false,
    followNavType: FollowType.FOLLOWING,
    followingActivePlatform: SocailPlatform.Lens,
    followersActivePlatform: SocailPlatform.Lens,
    followingPlatformCount: {
      [SocailPlatform.Lens]: 0,
      [SocailPlatform.Farcaster]: 0,
    },
    followersPlatformCount: {
      [SocailPlatform.Lens]: 0,
      [SocailPlatform.Farcaster]: 0,
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

  const address = getAddressWithDidPkh(currProfileDid || '');

  const { bioLinkList } = useBioLinkListWithDid(did);
  const lensBioLinkProfiles = bioLinkList
    ?.filter((link) => link.platform === BIOLINK_PLATFORMS.lens)
    ?.map((item) => {
      try {
        return JSON.parse(item.data) as LensProfile;
      } catch (error) {
        return null;
      }
    })
    .filter((item) => !!item);
  const { data: lensProfiles } = useProfilesOwnedBy({
    address: lensBioLinkProfiles[0]?.ownedBy || '',
  });
  const lensProfileFirst = lensProfiles?.[0];

  const fcastBioLinkProfiles = bioLinkList
    ?.filter((link) => link.platform === BIOLINK_PLATFORMS.farcaster)
    ?.map((item) => {
      try {
        return JSON.parse(item.data) as { fid: string };
      } catch (error) {
        return null;
      }
    })
    .filter((item) => !!item);
  const fid = fcastBioLinkProfiles[0]?.fid;

  const { farcasterFollowData } = useFarcasterFollowNum(fid);

  useEffect(() => {
    setFollowNavData((prevData) => ({
      ...prevData,
      followingPlatformCount: {
        [SocailPlatform.Lens]: lensProfileFirst?.stats.totalFollowing || 0,
        [SocailPlatform.Farcaster]: farcasterFollowData.following,
      },
      followersPlatformCount: {
        [SocailPlatform.Lens]: lensProfileFirst?.stats.totalFollowers || 0,
        [SocailPlatform.Farcaster]: farcasterFollowData.followers,
      },
    }));
  }, [lensProfileFirst, farcasterFollowData]);

  const { getProfileWithDid } = useProfileState();
  const [hasProfile, setHasProfile] = useState(false);
  const [hasProfileLoading, setHasProfileLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (user && !didLoading && did) {
        setHasProfileLoading(true);
        const profile = await getProfileWithDid(did);
        if (profile) {
          setHasProfile(true);
        }
        setHasProfileLoading(false);
      }
    })();
  }, [user, didLoading, did]);

  if (user) {
    if (didLoading || hasProfileLoading) {
      return (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      );
    }
    if (!did || !hasProfile) {
      return <NotU3User />;
    }
  }

  return (
    <ProfileWrapper id="profile-wrapper">
      {isMobile && (
        <ProfileInfoMobileWrapper>
          <ProfileInfoMobile did={currProfileDid} />
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
            feedsType={profilePageFeedsType}
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
              did={currProfileDid}
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
              <LogoutButton
                className="logout-button"
                onClick={() => {
                  setOpenLogoutConfirm(true);
                }}
              />
            )}
          </MainLeft>
        )}

        {(() => {
          if (showFollowNav) {
            if (
              followNavType === FollowType.FOLLOWING &&
              followingActivePlatform === SocailPlatform.Lens
            ) {
              return <LensProfileFollowing address={address} />;
            }
            if (
              followNavType === FollowType.FOLLOWERS &&
              followersActivePlatform === SocailPlatform.Lens
            ) {
              return <LensProfileFollowers address={address} />;
            }
            if (
              followNavType === FollowType.FOLLOWING &&
              followingActivePlatform === SocailPlatform.Farcaster
            ) {
              return <FarcasterFollowing />;
            }
            if (
              followNavType === FollowType.FOLLOWERS &&
              followersActivePlatform === SocailPlatform.Farcaster
            ) {
              return <FarcasterFollowers />;
            }
            return null;
          }
          return (
            <KeepAlive
              cacheKey={`${RouteKey.profile}_social_${
                lensProfileFirst?.id || '0'
              }_${fid || '0'}_${profilePageFeedsType}`}
              saveScrollPosition="#profile-wrapper"
            >
              <ProfileSocial
                lensProfileId={lensProfileFirst?.id}
                fid={fid}
                feedsType={profilePageFeedsType}
              />
            </KeepAlive>
          );
        })()}

        {!isMobile && <MainRight />}
      </MainWrapper>

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
    </ProfileWrapper>
  );
}

function ProfileInfo({
  clickFollowing,
  clickFollowers,
  did,
  ...props
}: StyledComponentPropsWithRef<'div'> & {
  clickFollowing?: () => void;
  clickFollowers?: () => void;
  did: string;
}) {
  return (
    <ProfileInfoWrap {...props}>
      <ProfileInfoCard
        did={did}
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

function NotU3User() {
  return (
    <ProfileWrapper>
      <NotU3UserText>NOT u3 user</NotU3UserText>
    </ProfileWrapper>
  );
}
const NotU3UserText = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #718096;
  text-align: center;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
