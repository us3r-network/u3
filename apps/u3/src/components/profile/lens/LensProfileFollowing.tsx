import {
  LimitType,
  Profile,
  useProfileFollowing,
} from '@lens-protocol/react-web';
import { useCallback, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import LensFollowProfileCard from './LensFollowProfileCard';
import Loading from '../../common/loading/Loading';
import {
  FollowList,
  FollowListWrapper,
  LoadingMoreWrapper,
  LoadingWrapper,
} from '../FollowListWidgets';

export default function LensProfileFollowing({
  lensProfile,
}: {
  lensProfile: Profile;
}) {
  // const { data: lensProfiles } = useProfiles({
  //   where: {
  //     ownedBy: [address],
  //   },
  // });
  // const lensProfile = lensProfiles?.[0];
  const {
    data: followingData,
    loading: firstLoading,
    hasMore,
    next,
  } = useProfileFollowing({
    limit: LimitType.TwentyFive,
    for: lensProfile?.id,
  });

  const [moreLoading, setMoreLoading] = useState(false);
  const loadMore = useCallback(async () => {
    if (!moreLoading && hasMore) {
      setMoreLoading(true);
      try {
        await next();
      } catch (error) {
        console.error(error);
      } finally {
        setMoreLoading(false);
      }
    }
  }, [hasMore, next, moreLoading]);
  return (
    <FollowListWrapper>
      {(() => {
        if (firstLoading) {
          return (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          );
        }
        return (
          <InfiniteScroll
            dataLength={followingData?.length || 0}
            next={() => {
              if (moreLoading) return;
              loadMore();
            }}
            hasMore={hasMore}
            loader={
              moreLoading ? (
                <LoadingMoreWrapper>
                  <Loading />
                </LoadingMoreWrapper>
              ) : null
            }
            scrollableTarget="profile-wrapper"
          >
            <FollowList>
              {(followingData || []).map((item) => (
                <LensFollowProfileCard
                  key={item.id}
                  profile={item}
                  isFollowingCard
                />
              ))}
            </FollowList>
          </InfiniteScroll>
        );
      })()}
    </FollowListWrapper>
  );
}
