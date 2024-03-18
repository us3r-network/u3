import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'src/components/common/loading/Loading';
import { EndMsgContainer } from '@/components/social/CommonStyles';
import { FollowType } from '@/container/profile/Contacts';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import useFarcasterLinks from '@/hooks/social/farcaster/useFarcasterLinks';
import FarcasterFollowProfileCard from './FarcasterFollowProfileCard';
import {
  FollowList,
  FollowListWrapper,
  LoadingMoreWrapper,
  LoadingWrapper,
} from './FollowListWidgets';

export default function FarcasterFollowing({ fid }: { fid: string | number }) {
  const { following } = useFarcasterCtx();
  const {
    links,
    firstLoading,
    moreLoading,
    hasMore,
    farcasterUserData,
    loadMore,
  } = useFarcasterLinks({
    fid,
    pageSize: 20,
    type: FollowType.FOLLOWING,
  });

  if (firstLoading) {
    return (
      <FollowListWrapper>
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      </FollowListWrapper>
    );
  }
  return (
    <FollowListWrapper id="follow-warper" className="h-full overflow-auto">
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={links?.length || 0}
        next={() => {
          if (moreLoading) return;
          loadMore();
        }}
        hasMore={!firstLoading && !moreLoading && hasMore}
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
          {(links || []).map((item) => (
            <FarcasterFollowProfileCard
              key={item.targetFid}
              fid={String(item.targetFid)}
              following={following || []}
              farcasterUserData={farcasterUserData}
            />
          ))}
        </FollowList>
      </InfiniteScroll>
    </FollowListWrapper>
  );
}
