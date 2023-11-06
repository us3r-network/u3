import { useState } from 'react';
import useFarcasterUserData from 'src/hooks/social/farcaster/useFarcasterUserData';
import { SocialPlatform } from 'src/services/social/types';
import useFarcasterFollowAction from 'src/hooks/social/farcaster/useFarcasterFollowAction';

import FollowProfileCard from '../FollowProfileCard';

export default function FarcasterFollowProfileCard({
  fid,
  following,
  farcasterUserData,
}: {
  fid: string;
  following: string[];
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
}) {
  const [followPending, setFollowPending] = useState(false);
  const [unfollowPending, setUnfollowPending] = useState(false);
  const [followed, setFollowed] = useState(following.includes(fid));

  const { followAction, unfollowAction } = useFarcasterFollowAction();

  const data = useFarcasterUserData({ fid, farcasterUserData });

  return (
    <FollowProfileCard
      data={{
        handle: data.userName,
        address: '',
        name: data.display || data.fid,
        avatar: data.pfp,
        bio: data.bio,
        isFollowed: followed,
        platforms: [SocialPlatform.Farcaster],
      }}
      followPending={followPending}
      unfollowPending={unfollowPending}
      followAction={async () => {
        setFollowPending(true);
        await followAction(Number(fid));
        setFollowed(true);
        setFollowPending(false);
      }}
      unfollowAction={async () => {
        setUnfollowPending(true);
        await unfollowAction(Number(fid));
        setFollowed(false);
        setUnfollowPending(false);
      }}
    />
  );
}
