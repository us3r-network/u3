import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import FarcasterFollowers from '@/components/profile/contacts/FarcasterFollowers';
import FarcasterFollowing from '@/components/profile/contacts/FarcasterFollowing';
import LensProfileFollowers from '@/components/profile/contacts/LensProfileFollowers';
import LensProfileFollowing from '@/components/profile/contacts/LensProfileFollowing';
import FollowingDefault from '@/components/social/FollowingDefault';
import useFarcasterUserStats from '@/hooks/social/farcaster/useFarcasterUserStats';
import { SocialPlatform } from '@/services/social/types';
import { ProfileOutletContext } from './ProfileLayout';
import PlatformFilter from '@/components/shared/select/PlatformFilter';

export enum FollowType {
  FOLLOWING = 'following',
  FOLLOWER = 'follower',
}

export default function Contacts() {
  const { fid, lensProfileFirst } = useOutletContext<ProfileOutletContext>();
  const [searchParams] = useSearchParams();
  const [followNavData, setFollowNavData] = useState({
    type: searchParams.get('type') || FollowType.FOLLOWING,
    platform: SocialPlatform.Farcaster,
    followingPlatformCount: {
      [SocialPlatform.Lens]: 0,
      [SocialPlatform.Farcaster]: 0,
    },
    followersPlatformCount: {
      [SocialPlatform.Lens]: 0,
      [SocialPlatform.Farcaster]: 0,
    },
  });
  const { type, platform, followingPlatformCount, followersPlatformCount } =
    followNavData;

  const { farcasterUserStats } = useFarcasterUserStats(fid);

  useEffect(() => {
    setFollowNavData((prevData) => ({
      ...prevData,
      followingPlatformCount: {
        [SocialPlatform.Lens]: lensProfileFirst?.stats.following || 0,
        [SocialPlatform.Farcaster]: farcasterUserStats.followingCount,
      },
      followersPlatformCount: {
        [SocialPlatform.Lens]: lensProfileFirst?.stats.followers || 0,
        [SocialPlatform.Farcaster]: farcasterUserStats.followerCount,
      },
    }));
  }, [lensProfileFirst, farcasterUserStats]);
  const [tab, setTab] = useState(type);
  return (
    <div
      className="
        w-full
        h-full
        overflow-scroll
        box-border
        p-[24px]"
      id="profile-wrapper"
    >
      <Tabs
        className="h-full"
        value={tab}
        onValueChange={(v) => {
          setTab(v);
        }}
      >
        <div className="flex items-center justify-between">
          <TabsList className="flex gap-5 justify-start bg-inherit">
            <TabsTrigger
              value={FollowType.FOLLOWING}
              className={cn(
                'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
              )}
            >
              {`Following(${followingPlatformCount[platform]})`}
            </TabsTrigger>
            <TabsTrigger
              value={FollowType.FOLLOWER}
              className={cn(
                'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
              )}
            >
              {`Followers(${followersPlatformCount[platform]})`}
            </TabsTrigger>
          </TabsList>
          <div>
            <PlatformFilter
              defaultValue={platform}
              onChange={(v) => {
                setFollowNavData((prevData) => ({
                  ...prevData,
                  platform: v,
                }));
              }}
            />
          </div>
        </div>
        <TabsContent
          id="profile-contacts-following-warper"
          value={FollowType.FOLLOWING}
          className="h-full"
        >
          {(() => {
            if (platform === SocialPlatform.Lens) {
              return <LensProfileFollowing lensProfile={lensProfileFirst} />;
            }
            if (platform === SocialPlatform.Farcaster) {
              return <FarcasterFollowing fid={fid} />;
            }
            if (!lensProfileFirst?.id && !fid) {
              return <FollowingDefault />;
            }
            return null;
          })()}
        </TabsContent>
        <TabsContent
          id="profile-contacts-follower-warper"
          value={FollowType.FOLLOWER}
          className="h-full"
        >
          {(() => {
            if (platform === SocialPlatform.Lens) {
              return <LensProfileFollowers lensProfile={lensProfileFirst} />;
            }
            if (platform === SocialPlatform.Farcaster) {
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
