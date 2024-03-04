import { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import CommunityMenu from './CommunityMenu';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import Loading from '@/components/common/loading/Loading';
import useLoadCommunityMembers from '@/hooks/community/useLoadCommunityMembers';
import useLoadCommunityTopMembers from '@/hooks/community/useLoadCommunityTopMembers';
import { CommunityInfo } from '@/services/community/types/community';
import { fetchCommunity } from '@/services/community/api/community';
import useLogin from '@/hooks/shared/useLogin';

export default function CommunityLayout() {
  const { isLogin, login } = useLogin();
  const { channelId } = useParams();

  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityInfo, setCommunityInfo] = useState<CommunityInfo | null>();
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

  const {
    farcasterChannels,
    setDefaultPostChannelId,
    userChannels,
    joinChannel,
    openFarcasterQR,
    isConnected: isLoginFarcaster,
  } = useFarcasterCtx();

  useEffect(() => {
    setDefaultPostChannelId(channelId);
    return () => {
      setDefaultPostChannelId('home');
    };
  }, [channelId, setDefaultPostChannelId]);

  const channel = farcasterChannels.find((c) => c?.channel_id === channelId);
  const [joining, setJoining] = useState(false);
  const parentUrl = channel?.parent_url;
  const joined = useMemo(() => {
    const joinItem = userChannels.find((c) => c.parent_url === parentUrl);
    return !!joinItem;
  }, [userChannels, parentUrl]);

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

  if (communityLoading) {
    <div className="w-full h-full flex justify-center items-center">
      <Loading />
    </div>;
  }

  if (!communityInfo?.id) {
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col">
      {!joined && (
        <GuestModeHeader
          className="max-sm:hidden"
          joining={joining}
          joinAction={async () => {
            if (!isLogin) {
              login();
              return;
            }
            if (!isLoginFarcaster) {
              openFarcasterQR();
              return;
            }
            setJoining(true);
            await joinChannel(parentUrl);
            await new Promise((resolve) => {
              setTimeout(resolve, 1000);
            });
            toast.success('Join success');
            setJoining(false);
          }}
        />
      )}

      <div className={cn('w-full h-0 flex-1 flex', 'max-sm:flex-col')}>
        <CommunityMenu
          communityInfo={communityInfo}
          channelId={channel?.channel_id}
          joined={joined}
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
  joinAction,
  joining,
  ...props
}: ComponentPropsWithRef<'div'> & {
  joined?: boolean;
  joining?: boolean;
  joinAction?: () => void;
  unjoinAction?: () => void;
}) {
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
        className="px-[12px] h-[22px] box-border rounded-[4px] border-[1px] border-solid border-[#FFF] text-[#FFF] text-[12px] font-normal"
        onClick={() => {
          joinAction?.();
        }}
      >
        {joining ? 'Joining...' : 'Join the community'}
      </button>
      {/* <Button className="px-[12px] h-[22px] box-border rounded-[4px] border-[1px] border-solid border-[#FFF] text-[#FFF] text-[12px] font-normal">
        Mint NFT & Add to Shortcut
      </Button> */}
    </div>
  );
}
