import { useState } from 'react';
import useFarcasterFollowAction from '@/hooks/social/farcaster/useFarcasterFollowAction';
import useFarcasterUserData from '@/hooks/social/farcaster/useFarcasterUserData';
import { MemberEntity } from '@/services/community/types/community';
import { SocialPlatform } from '@/services/social/types';
import MemberItem from './MemberItem';

const formatFarcasterUserData = (data) => {
  const temp: {
    [key: string]: { type: number; value: string }[];
  } = {};
  data.forEach((item) => {
    if (temp[item.fid]) {
      temp[item.fid].push(item);
    } else {
      temp[item.fid] = [item];
    }
  });
  return temp;
};
export default function FarcasterMemberItem({
  following,
  data,
}: {
  following: string[];
  data: MemberEntity;
}) {
  const { fid, data: memberData } = data;
  const [followPending, setFollowPending] = useState(false);
  const [unfollowPending, setUnfollowPending] = useState(false);
  const [followed, setFollowed] = useState(following.includes(fid));

  const { followAction, unfollowAction } = useFarcasterFollowAction();

  const farcasterUserData = useFarcasterUserData({
    fid,
    farcasterUserData: formatFarcasterUserData(memberData),
  });
  const avatar = farcasterUserData.pfp;
  const name = farcasterUserData.display || farcasterUserData.fid;
  const { bio } = farcasterUserData;
  const handle = farcasterUserData.userName;
  return (
    <MemberItem
      data={{
        handle,
        address: '',
        name,
        avatar,
        bio,
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
