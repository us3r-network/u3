import {
  useActiveProfile,
  useProfileFollowers,
  useProfilesOwnedBy,
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

export default function LensProfileFollowers({ address }: { address: string }) {
  const { data: lensActiveProfile } = useActiveProfile();
  const { data: lensProfiles } = useProfilesOwnedBy({
    address,
  });
  const lensProfile = lensProfiles?.[0];
  const {
    data: followersData,
    loading: firstLoading,
    hasMore,
    next,
  } = useProfileFollowers({
    limit: 20,
    observerId: lensActiveProfile?.id,
    profileId: lensProfile.id,
  });

  const followersList = useMemo(() => {
    return (
      followersData?.map((item) => ({
        handle: item.wallet.defaultProfile.handle,
        address: item.wallet.defaultProfile.ownedBy,
        name: item.wallet.defaultProfile.name,
        avatar: getAvatar(item.wallet.defaultProfile),
        bio: item.wallet.defaultProfile.bio,
        isFollowed: item.wallet.defaultProfile.isFollowedByMe,
        platforms: [SocailPlatform.Lens],
      })) || []
    );
  }, [followersData]);

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
            dataLength={followersList.length}
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
              {followersList.map((item) => (
                <LensFollowProfileCard data={item} lensProfile={lensProfile} />
              ))}
            </FollowList>
          </InfiniteScroll>
        );
      })()}
    </FollowListWrapper>
  );
}
