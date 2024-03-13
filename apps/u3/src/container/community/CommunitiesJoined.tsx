import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'src/components/common/loading/Loading';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
} from '@/components/social/CommonStyles';
import { CommunityList } from '@/components/community/CommonStyled';
import CommunityItem from '@/components/community/CommunityItem';
import useLoadJoinedCommunities from '@/hooks/community/useLoadJoinedCommunities';

export default function CommunitiesJoined() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { communitiesCachedData, communityTypeFilter } =
    useOutletContext<any>();
  const joinedCachedData = communitiesCachedData?.joined;

  const { loading, joinedCommunities, loadJoinedCommunities, pageInfo } =
    useLoadJoinedCommunities({
      cachedDataRefValue: joinedCachedData,
    });

  useEffect(() => {
    if (!mounted) return;
    loadJoinedCommunities({ type: communityTypeFilter });
  }, [mounted, communityTypeFilter]);

  return (
    <div className="w-full">
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={joinedCommunities.length}
        next={() => {
          if (loading) return;
          loadJoinedCommunities({ type: communityTypeFilter });
        }}
        hasMore={pageInfo.hasNextPage}
        loader={
          <LoadingMoreWrapper>
            <Loading />
          </LoadingMoreWrapper>
        }
        endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
        scrollableTarget="communities-scroll-wrapper"
      >
        <CommunityList>
          {joinedCommunities.map((data) => (
            <CommunityItem key={data.id} communityInfo={data} />
          ))}
        </CommunityList>
      </InfiniteScroll>
    </div>
  );
}
