import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'src/components/common/loading/Loading';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
} from '@/components/social/CommonStyles';
import useLoadGrowingCommunities from '@/hooks/community/useLoadGrowingCommunities';
import { CommunityList } from '@/components/community/CommonStyled';
import GrowingCommunityItem from '@/components/community/GrowingCommunityItem';

export default function CommunitiesGrowing() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { loading, growingCommunities, loadGrowingCommunities, pageInfo } =
    useLoadGrowingCommunities();

  useEffect(() => {
    if (!mounted) return;
    loadGrowingCommunities();
  }, [mounted]);

  return (
    <div
      className="w-full h-full overflow-auto p-[20px] box-border max-sm:p-[10px]"
      id="growing-communities-scroll-wrapper"
    >
      <h3 className="text-[#718096] text-[14px] font-medium mb-[20px] box-border">
        Growing Communities
      </h3>
      <InfiniteScroll
        style={{ overflow: 'hidden' }}
        dataLength={growingCommunities.length}
        next={() => {
          if (loading) return;
          loadGrowingCommunities();
        }}
        hasMore={pageInfo.hasNextPage}
        loader={
          <LoadingMoreWrapper>
            <Loading />
          </LoadingMoreWrapper>
        }
        endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
        scrollableTarget="growing-communities-scroll-wrapper"
      >
        <div className="flex flex-col gap-[20px] max-sm:gap-[10px]">
          {growingCommunities.map((data, idx) => (
            <GrowingCommunityItem
              key={data.id}
              ranking={idx + 1}
              communityInfo={data}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
