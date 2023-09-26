import { useState } from 'react';
import useFarcasterUserData from 'src/hooks/farcaster/useFarcasterUserData';
import { SocailPlatform } from 'src/api';
import useFarcasterFollowAction from 'src/hooks/farcaster/useFarcasterFollowAction';

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
        handle: data.display,
        address: '',
        name: data.userName || data.fid,
        avatar: data.pfp,
        bio: data.bio,
        isFollowed: followed,
        platforms: [SocailPlatform.Farcaster],
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