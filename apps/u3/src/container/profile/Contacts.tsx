import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import FarcasterFollowers from '@/components/profile/farcaster/FarcasterFollowers';
import FarcasterFollowing from '@/components/profile/farcaster/FarcasterFollowing';
import LensProfileFollowers from '@/components/profile/lens/LensProfileFollowers';
import LensProfileFollowing from '@/components/profile/lens/LensProfileFollowing';
import FollowingDefault from '@/components/social/FollowingDefault';
import useFarcasterFollowNum from '@/hooks/social/farcaster/useFarcasterFollowNum';
import { SocialPlatform } from '@/services/social/types';
import { ProfileOutletContext } from './ProfileLayout';

export enum FollowType {
  FOLLOWING = 'following',
  FOLLOWERS = 'followers',
}

export default function Contacts() {
  const { fid, lensProfileFirst } = useOutletContext<ProfileOutletContext>();
  const [searchParams] = useSearchParams();
  const [followNavData, setFollowNavData] = useState({
    showFollowNav: false,
    followNavType: searchParams.get('type') || FollowType.FOLLOWING,
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
  const [tab, setTab] = useState(followNavType);
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
      <Tabs
        className="h-60"
        value={tab}
        onValueChange={(v) => {
          if (v === 'TabTransaction') {
            localStorage.setItem('tipTab', 'TabTransaction');
          }
          setTab(v);
        }}
      >
        <TabsList className="flex gap-5 justify-start w-full mb-7 bg-inherit">
          <TabsTrigger
            value={FollowType.FOLLOWING}
            className={cn(
              'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
            )}
          >
            {`Following(${followingPlatformCount[followingActivePlatform]})`}
          </TabsTrigger>
          <TabsTrigger
            value={FollowType.FOLLOWERS}
            className={cn(
              'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
            )}
          >
            {`Followers(${followersPlatformCount[followingActivePlatform]})`}
          </TabsTrigger>
        </TabsList>
        <TabsContent value={FollowType.FOLLOWING}>
          {(() => {
            if (followingActivePlatform === SocialPlatform.Lens) {
              return <LensProfileFollowing lensProfile={lensProfileFirst} />;
            }
            if (followingActivePlatform === SocialPlatform.Farcaster) {
              return <FarcasterFollowing fid={fid} />;
            }
            if (!lensProfileFirst?.id && !fid) {
              return <FollowingDefault />;
            }
            return null;
          })()}
        </TabsContent>
        <TabsContent value={FollowType.FOLLOWERS}>
          {(() => {
            if (followersActivePlatform === SocialPlatform.Lens) {
              return <LensProfileFollowers lensProfile={lensProfileFirst} />;
            }
            if (followersActivePlatform === SocialPlatform.Farcaster) {
              return <FarcasterFollowers fid={fid} />;
            }
            if (!lensProfileFirst?.id && !fid) {
              return <FollowingDefault />;
            }
            return null;
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
