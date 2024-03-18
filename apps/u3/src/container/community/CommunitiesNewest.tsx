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
import useLoadNewestCommunities from '@/hooks/community/useLoadNewestCommunities';

export default function CommunitiesNewest() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { communitiesCachedData, communityTypeFilter } =
    useOutletContext<any>();
  const newestCachedData = communitiesCachedData?.newest;

  const { loading, newestCommunities, loadNewestCommunities, pageInfo } =
    useLoadNewestCommunities({
      cachedDataRefValue: newestCachedData,
    });

  useEffect(() => {
    if (!mounted) return;
    loadNewestCommunities({ type: communityTypeFilter });
  }, [mounted, communityTypeFilter]);

  return (
    <div className="w-full p-[20px] box-border max-sm:p-[10px]">
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={newestCommunities.length}
        next={() => {
          if (loading) return;
          loadNewestCommunities({ type: communityTypeFilter });
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
          {newestCommunities.map((data) => (
            <CommunityItem key={data.id} communityInfo={data} />
          ))}
        </CommunityList>
      </InfiniteScroll>
    </div>
  );
}
