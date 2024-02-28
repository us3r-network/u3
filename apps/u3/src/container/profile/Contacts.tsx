import { useEffect, useMemo, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import ProfilePageFollowNav, {
  FollowType,
} from '../../components/profile/ProfilePageFollowNav';
import FarcasterFollowers from '../../components/profile/farcaster/FarcasterFollowers';
import FarcasterFollowing from '../../components/profile/farcaster/FarcasterFollowing';
import LensProfileFollowers from '../../components/profile/lens/LensProfileFollowers';
import LensProfileFollowing from '../../components/profile/lens/LensProfileFollowing';
import FollowingDefault from '../../components/social/FollowingDefault';
import useFarcasterFollowNum from '../../hooks/social/farcaster/useFarcasterFollowNum';
import { SocialPlatform } from '../../services/social/types';
import { ProfileOutletContext } from './ProfileLayout';

export default function Contacts() {
  const { fid, lensProfileFirst } = useOutletContext<ProfileOutletContext>();
  const [searchParams] = useSearchParams();
  const currSearchParams = useMemo(
    () => ({
      followType: searchParams.get('followType') || '',
    }),
    [searchParams]
  );
  const { followType } = currSearchParams;
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
        [SocialPlatform.Lens]: lensProfileFirst?.stats.following || 0,
        [SocialPlatform.Farcaster]: farcasterFollowData.following,
      },
      followersPlatformCount: {
        [SocialPlatform.Lens]: lensProfileFirst?.stats.followers || 0,
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

  return (
    <div
      className="
    w-full
    h-full
    overflow-scroll
    box-border
    p-[24px]
    mb-[20px]"
      id="profile-wrapper"
    >
      {(() => {
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
      })()}

      <div
        className="mt-[20px]
                    flex
                    gap-[40px]"
      >
        {(() => {
          if (
            followNavType === FollowType.FOLLOWING &&
            followingActivePlatform === SocialPlatform.Lens
          ) {
            return <LensProfileFollowing lensProfile={lensProfileFirst} />;
          }
          if (
            followNavType === FollowType.FOLLOWERS &&
            followersActivePlatform === SocialPlatform.Lens
          ) {
            return <LensProfileFollowers lensProfile={lensProfileFirst} />;
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
          if (!lensProfileFirst?.id && !fid) {
            return <FollowingDefault />;
          }
          return null;
        })()}
      </div>
    </div>
  );
}
