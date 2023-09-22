import {
  useActiveProfile,
  useProfileFollowing,
} from '@lens-protocol/react-web';
import { useCallback, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import getAvatar from '../../../utils/lens/getAvatar';
import { SocailPlatform } from '../../../api';
import LensFollowProfileCard from './LensFollowProfileCard';
import Loading from '../../common/loading/Loading';
import {
  FollowList,
  FollowListWrapper,
  LoadingMoreWrapper,
  LoadingWrapper,
} from '../FollowListWidgets';

export default function LensProfileFollowing({ address }: { address: string }) {
  const { data: lensActiveProfile } = useActiveProfile();
  const {
    data: followingData,
    loading: firstLoading,
    hasMore,
    next,
  } = useProfileFollowing({
    limit: 20,
    observerId: lensActiveProfile?.id,
    walletAddress: address,
  });

  const followingList = useMemo(() => {
    return (
      followingData?.map((item) => ({
        handle: item.profile.handle,
        address: item.profile.ownedBy,
        name: item.profile.name,
        avatar: getAvatar(item.profile),
        bio: item.profile.bio,
        isFollowed: item.profile.isFollowedByMe,
        platforms: [SocailPlatform.Lens],
      })) || []
    );
  }, [followingData]);

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
            dataLength={followingList.length}
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
              {followingList.map((item) => (
                <LensFollowProfileCard
                  data={item}
                  lensProfile={lensActiveProfile}
                />
              ))}
            </FollowList>
          </InfiniteScroll>
        );
      })()}
    </FollowListWrapper>
  );
}
