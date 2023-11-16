import {
  LimitType,
  useProfileFollowers,
  useProfiles,
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

export default function LensProfileFollowers({ address }: { address: string }) {
  const { data: lensProfiles } = useProfiles({
    where: {
      ownedBy: [address],
    },
  });
  const lensProfile = lensProfiles?.[0];
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
            scrollableTarget="profile-wrapper"
          >
            <FollowList>
              {(followersData || []).map((item) => (
                <LensFollowProfileCard profile={item} />
              ))}
            </FollowList>
          </InfiniteScroll>
        );
      })()}
    </FollowListWrapper>
  );
}
