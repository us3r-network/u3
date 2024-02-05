import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';

export default function MembersLayout() {
  return (
    <div className="w-full h-full flex">
      <div className="flex-1 h-full">
        <TotalMembers />
      </div>
      <div className="w-[320px] h-full">
        <TopMembers />
      </div>
    </div>
  );
}

function TotalMembers() {
  const { openFarcasterQR } = useFarcasterCtx();
  const {
    members,
    membersPageInfo,
    membersFirstLoading,
    membersMoreLoading,
    loadFirstMembers,
    loadMoreMembers,
  } = useOutletContext<any>();
  const membersLen = members.length;
  useEffect(() => {
    if (membersLen === 0) {
      loadFirstMembers();
    }
  }, [membersLen]);

  return (
    <div className="w-full h-full flex flex-col">
      <div>Total Members ({membersLen})</div>
      <div id="total-members-scroll-wrapper" className="flex-1 overflow-y-auto">
        {(membersFirstLoading && (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        )) || (
          <InfiniteScroll
            style={{ overflow: 'hidden' }}
            dataLength={membersLen}
            next={() => {
              if (membersMoreLoading) return;
              loadMoreMembers();
            }}
            hasMore={membersPageInfo?.hasNextPage || false}
            loader={
              <div className="w-full h-full flex justify-center items-center">
                <Loading />
              </div>
            }
            scrollableTarget="total-members-scroll-wrapper"
          >
            <div>
              {members.map((member) => {
                return (
                  <div key={member.id} className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="ml-3">{member.name}</div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

function TopMembers() {
  const { openFarcasterQR } = useFarcasterCtx();
  const { topMembers, topMembersLoading, loadTopMembers } =
    useOutletContext<any>();
  const membersLen = topMembers.length;
  useEffect(() => {
    if (membersLen === 0) {
      loadTopMembers();
    }
  }, [membersLen]);

  return (
    <div className="w-full h-full flex flex-col">
      <div>✨ Top 10 Community Stars</div>
      <div className="flex-1 overflow-y-auto">
        {topMembersLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            {topMembers.map((member) => {
              return (
                <div key={member.id} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-200" />
                  <div className="ml-3">{member.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
