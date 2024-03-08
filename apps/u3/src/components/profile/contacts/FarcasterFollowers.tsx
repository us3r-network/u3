import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '@/components/common/loading/Loading';
import {
  FollowList,
  FollowListWrapper,
  LoadingMoreWrapper,
  LoadingWrapper,
} from './FollowListWidgets';
import FarcasterFollowProfileCard from './FarcasterFollowProfileCard';
import useFarcasterLinks from '@/hooks/social/farcaster/useFarcasterLinks';
import { FollowType } from '@/container/profile/Contacts';
import { EndMsgContainer } from '@/components/social/CommonStyles';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function FarcasterFollowers({ fid }: { fid: string | number }) {
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
    type: FollowType.FOLLOWER,
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
              key={item.fid}
              fid={String(item.fid)}
              following={following || []}
              farcasterUserData={farcasterUserData}
            />
          ))}
        </FollowList>
      </InfiniteScroll>
    </FollowListWrapper>
  );
}
