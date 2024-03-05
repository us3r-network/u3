import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import FarcasterFollowers from '@/components/profile/contacts/FarcasterFollowers';
import FarcasterFollowing from '@/components/profile/contacts/FarcasterFollowing';
import LensProfileFollowers from '@/components/profile/contacts/LensProfileFollowers';
import LensProfileFollowing from '@/components/profile/contacts/LensProfileFollowing';
import FollowingDefault from '@/components/social/FollowingDefault';
import useFarcasterFollowNum from '@/hooks/social/farcaster/useFarcasterFollowNum';
import { SocialPlatform } from '@/services/social/types';
import { ProfileOutletContext } from './ProfileLayout';
import PlatformFilter from '@/components/shared/select/PlatformFilter';

export enum FollowType {
  FOLLOWING = 'following',
  FOLLOWERS = 'followers',
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
  const [tab, setTab] = useState(type);
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
        <div className="flex items-center justify-between">
          <TabsList className="flex gap-5 justify-start w-full bg-inherit">
            <TabsTrigger
              value={FollowType.FOLLOWING}
              className={cn(
                'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
              )}
            >
              {`Following(${followingPlatformCount[platform]})`}
            </TabsTrigger>
            <TabsTrigger
              value={FollowType.FOLLOWERS}
              className={cn(
                'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
              )}
            >
              {`Followers(${followersPlatformCount[platform]})`}
            </TabsTrigger>
          </TabsList>
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
        <TabsContent value={FollowType.FOLLOWING}>
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
        <TabsContent value={FollowType.FOLLOWERS}>
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
