import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from 'src/components/common/loading/Loading';
import { useEffect } from 'react';
import useLoadCommunityMembers from '@/hooks/community/useLoadCommunityMembers';
import FarcasterMemberItem from '@/components/community/FarcasterMemberItem';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function MembersLayout() {
  return (
    <div className="w-full h-full flex">
      <div className="flex-1 h-full">
        <TotalMembers />
      </div>
      {/* <div className="w-[320px] h-full">top members</div> */}
    </div>
  );
}

function TotalMembers() {
  const { following } = useFarcasterCtx();
  const { totalMembers, communityInfo } = useOutletContext<any>();
  const id = communityInfo?.id;
  const {
    communityMembers,
    loadCommunityMembers,
    loading: membersLoading,
    pageInfo,
  } = useLoadCommunityMembers();

  useEffect(() => {
    if (id) {
      loadCommunityMembers({ id });
    }
  }, [id]);

  return (
    <div className="w-full h-full flex flex-col px-[20px] max-sm:px-0">
      <div className="text-[#FFF] text-[14px] font-medium py-[20px] max-sm:hidden">
        Total Members ({totalMembers})
      </div>
      <div id="total-members-scroll-wrapper" className="flex-1 overflow-y-auto">
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={communityMembers.length}
          next={() => {
            if (!id || membersLoading) return;
            loadCommunityMembers({ id });
          }}
          hasMore={pageInfo?.hasNextPage || false}
          loader={
            <div className="w-full h-full flex justify-center items-center">
              <Loading />
            </div>
          }
          scrollableTarget="total-members-scroll-wrapper"
        >
          <div className="flex flex-col divide-y divide-[#39424C]">
            {communityMembers.map((data) => {
              return (
                <FarcasterMemberItem
                  key={data.fid}
                  following={following}
                  data={data}
                />
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
