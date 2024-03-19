import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import CommunityMenu from './CommunityMenu';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import Loading from '@/components/common/loading/Loading';
import useLoadCommunityMembers from '@/hooks/community/useLoadCommunityMembers';
import useLoadCommunityTopMembers from '@/hooks/community/useLoadCommunityTopMembers';
import { CommunityInfo } from '@/services/community/types/community';
import { fetchCommunity } from '@/services/community/api/community';
import CommunityMobileHeader from './CommunityMobileHeader';
import useJoinCommunityAction from '@/hooks/community/useJoinCommunityAction';
import useBrowsingCommunity from '@/hooks/community/useBrowsingCommunity';

export default function CommunityLayout() {
  const { channelId } = useParams();

  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityInfo, setCommunityInfo] = useState<CommunityInfo | null>();
  const communityId = communityInfo?.id;
  useEffect(() => {
    (async () => {
      setCommunityInfo(null);
      if (channelId) {
        try {
          setCommunityLoading(true);
          const res = await fetchCommunity(channelId);
          const data = res?.data?.data;
          setCommunityInfo(data);
        } catch (error) {
          console.error(error);
        } finally {
          setCommunityLoading(false);
        }
      }
    })();
  }, [channelId]);

  const { farcasterChannels, setDefaultPostChannelId } = useFarcasterCtx();

  useEffect(() => {
    setDefaultPostChannelId(channelId);
    return () => {
      setDefaultPostChannelId('home');
    };
  }, [channelId, setDefaultPostChannelId]);

  const channel = farcasterChannels.find((c) => c?.channel_id === channelId);

  const { setBrowsingCommunity, clearBrowsingCommunity } =
    useBrowsingCommunity();
  useEffect(() => {
    setBrowsingCommunity(communityInfo);
    return () => {
      clearBrowsingCommunity();
    };
  }, [communityInfo, setBrowsingCommunity, clearBrowsingCommunity]);

  // members state
  const {
    members,
    pageInfo: membersPageInfo,
    firstLoading: membersFirstLoading,
    moreLoading: membersMoreLoading,
    loadFirst: loadFirstMembers,
    loadMore: loadMoreMembers,
  } = useLoadCommunityMembers(channelId);

  const {
    members: topMembers,
    loading: topMembersLoading,
    load: loadTopMembers,
  } = useLoadCommunityTopMembers(channelId);

  const { joined } = useJoinCommunityAction(communityInfo);

  if (communityLoading) {
    <div className="w-full h-full flex justify-center items-center">
      <Loading />
    </div>;
  }

  if (!communityId) {
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col">
      {!joined && (
        <GuestModeHeader
          className="max-sm:hidden"
          communityInfo={communityInfo}
        />
      )}

      <div className={cn('w-full h-0 flex-1 flex', 'max-sm:flex-col')}>
        <CommunityMenu
          className="max-sm:hidden"
          communityInfo={communityInfo}
          channelId={channel?.channel_id}
        />
        <CommunityMobileHeader
          className="min-sm:hidden"
          communityInfo={communityInfo}
          channelId={channel?.channel_id}
        />
        <div
          className={cn(
            'flex-1 h-full overflow-auto',
            'max-sm:w-full max-sm:h-auto'
          )}
        >
          <Outlet
            context={{
              channelId,
              communityInfo,

              // TODO mentioned links

              // members state
              members,
              membersPageInfo,
              membersFirstLoading,
              membersMoreLoading,
              loadFirstMembers,
              loadMoreMembers,

              topMembers,
              topMembersLoading,
              loadTopMembers,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function GuestModeHeader({
  className,
  communityInfo,
  ...props
}: ComponentPropsWithRef<'div'> & {
  communityInfo: CommunityInfo;
}) {
  const { joined, isPending, isDisabled, joinChangeAction } =
    useJoinCommunityAction(communityInfo);
  return (
    <div
      className={cn(
        `
        w-full h-[42px] bg-[#F41F4C]
        rounded-t-[20px] rounded-tr-[20px]
        flex justify-center items-center gap-[20px] self-stretch
         text-[#FFF] text-[16px] font-medium leading-[20px]`,
        className
      )}
      {...props}
    >
      <span className="text-[16px] font-medium leading-[20px]">
        You are currently in guest mode.
      </span>
      <button
        type="button"
        className={cn(
          'px-[12px] h-[22px] box-border rounded-[4px] border-[1px] border-solid border-[#FFF] text-[#FFF] text-[12px] font-normal'
        )}
        disabled={isDisabled}
        onClick={(e) => {
          e.stopPropagation();
          joinChangeAction();
        }}
      >
        {(() => {
          if (joined) {
            if (isPending) {
              return 'Leaving ...';
            }
            return 'Leave Community';
          }
          if (isPending) {
            return 'Joining ...';
          }
          return 'Join the community';
        })()}
      </button>
      {/* <Button className="px-[12px] h-[22px] box-border rounded-[4px] border-[1px] border-solid border-[#FFF] text-[#FFF] text-[12px] font-normal">
      Mint NFT & Add to Shortcut
    </Button> */}
    </div>
  );
}
