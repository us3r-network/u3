import useFarcasterFollowData from 'src/hooks/social/farcaster/useFarcasterFollowData';
import Loading from 'src/components/common/loading/Loading';

import {
  FollowList,
  FollowListWrapper,
  LoadingWrapper,
} from './FollowListWidgets';
import FarcasterFollowProfileCard from './FarcasterFollowProfileCard';

export default function FarcasterFollowing({ fid }: { fid: string | number }) {
  const { farcasterFollowData, loading } = useFarcasterFollowData({
    fid,
  });
  const following = farcasterFollowData.followingData;

  if (loading) {
    return (
      <FollowListWrapper>
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      </FollowListWrapper>
    );
  }
  return (
    <FollowListWrapper>
      <FollowList>
        {(following || []).map((item) => (
          <FarcasterFollowProfileCard
            key={item}
            fid={item}
            following={following || []}
            farcasterUserData={farcasterFollowData.farcasterUserData}
          />
        ))}
      </FollowList>
    </FollowListWrapper>
  );
}
