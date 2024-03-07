import {
  LimitType,
  Profile,
  useProfileFollowers,
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
} from './FollowListWidgets';
import { EndMsgContainer } from '@/components/social/CommonStyles';

export default function LensProfileFollowers({
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
    data: followersData,
    loading: firstLoading,
    hasMore,
    next,
  } = useProfileFollowers({
    limit: LimitType.TwentyFive,
    of: lensProfile?.id,
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
    <FollowListWrapper id="follow-warper" className="h-full overflow-auto">
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
            dataLength={followersData?.length || 0}
            next={() => {
              if (moreLoading) return;
              loadMore();
            }}
            hasMore={!firstLoading && hasMore}
            loader={
              moreLoading ? (
                <LoadingMoreWrapper>
                  <Loading />
                </LoadingMoreWrapper>
              ) : null
            }
            endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
            scrollThreshold="2000px"
            scrollableTarget="follow-warper"
          >
            <FollowList>
              {(followersData || []).map((item) => (
                <LensFollowProfileCard key={item.id} profile={item} />
              ))}
            </FollowList>
          </InfiniteScroll>
        );
      })()}
    </FollowListWrapper>
  );
}
