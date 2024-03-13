import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'src/components/common/loading/Loading';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
} from '@/components/social/CommonStyles';
import useLoadTrendingCommunities from '@/hooks/community/useLoadTrendingCommunities';
import { CommunityList } from '@/components/community/CommonStyled';
import CommunityItem from '@/components/community/CommunityItem';

export default function CommunitiesTrending() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { communitiesCachedData, communityTypeFilter } =
    useOutletContext<any>();
  const trendingCachedData = communitiesCachedData?.trending;

  const { loading, trendingCommunities, loadTrendingCommunities, pageInfo } =
    useLoadTrendingCommunities({
      cachedDataRefValue: trendingCachedData,
    });

  useEffect(() => {
    if (!mounted) return;
    loadTrendingCommunities({ type: communityTypeFilter });
  }, [mounted, communityTypeFilter]);

  return (
    <div className="w-full p-[20px] box-border max-sm:p-[10px]">
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={trendingCommunities.length}
        next={() => {
          if (loading) return;
          loadTrendingCommunities({ type: communityTypeFilter });
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
          {trendingCommunities.map((data) => (
            <CommunityItem key={data.id} communityInfo={data} />
          ))}
        </CommunityList>
      </InfiniteScroll>
    </div>
  );
}
