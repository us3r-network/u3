import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import FeedsFilter from '@/components/shared/select/FeedsFilter';
import PlatformFilter from '@/components/shared/select/PlatformFilter';
import { SocialPlatform } from '@/services/social/types';
import { ProfileSocialPosts } from '../../components/profile/ProfileSocial';
import { LivepeerProvider } from '../../contexts/social/LivepeerCtx';
import { ProfileFeedsGroups } from '../../services/social/api/feeds';
import { ProfileOutletContext } from './ProfileLayout';

export default function Posts() {
  const { fid, lensProfileFirst } = useOutletContext<ProfileOutletContext>();
  const [feedsGroup, setFeedsGroup] = useState<ProfileFeedsGroups>(
    ProfileFeedsGroups.POSTS
  );
  const [platform, setPlatform] = useState<SocialPlatform>(
    SocialPlatform.Farcaster
  );
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
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold">Posts</h2>
        <div className="flex gap-2">
          <FeedsFilter
            defaultValue={ProfileFeedsGroups.POSTS}
            onChange={(v) => {
              setFeedsGroup(v);
            }}
          />
          <PlatformFilter
            defaultValue={SocialPlatform.Farcaster}
            onChange={(v) => {
              setPlatform(v);
            }}
          />
        </div>
      </div>
      <div
        className="mt-[20px]
                    flex
                    gap-[40px]"
      >
        <LivepeerProvider>
          <ProfileSocialPosts
            lensProfileId={
              platform === SocialPlatform.Lens ? lensProfileFirst?.id : ''
            }
            fid={platform === SocialPlatform.Farcaster ? fid : ''}
            group={feedsGroup as unknown as ProfileFeedsGroups}
          />
        </LivepeerProvider>
      </div>
    </div>
  );
}
