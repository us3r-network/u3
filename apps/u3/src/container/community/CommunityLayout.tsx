import { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import useFcTrendFeeds from 'src/hooks/social/useChannelFeeds';
import { toast } from 'react-toastify';
import { FeedsType } from '../../components/social/SocialPageNav';
import { SocialPlatform } from '../../services/social/types';
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
    currFid,
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

  // posts state
  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform | ''>('');
  const [postScroll, setPostScroll] = useState({
    currentParent: '',
    id: '',
    top: 0,
  });
  const {
    feeds: fcTrendFeeds,
    firstLoading: fcTrendFirstLoading,
    moreLoading: fcTrendMoreLoading,
    loadFirstFeeds: loadFcTrendFirstFeeds,
    loadMoreFeeds: loadFcTrendMoreFeeds,
    pageInfo: fcTrendPageInfo,
    farcasterUserDataObj: fcUserDataObj,
  } = useFcTrendFeeds();

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
    <CommunityLayoutWrapper className="flex justify-center items-center">
      <Loading />
    </CommunityLayoutWrapper>;
  }

  if (!communityInfo?.id) {
    return null;
  }
  return (
    <CommunityLayoutWrapper>
      {!joined && (
        <GuestModeHeader
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

      <div className="w-full h-0 flex-1 flex">
        <div className="w-[280px] h-full">
          <CommunityMenu
            communityInfo={communityInfo}
            channelId={channel?.channel_id}
            joined={joined}
          />
        </div>
        <div className="flex-1 h-full overflow-auto">
          <Outlet
            context={{
              channelId,
              communityInfo,

              // posts state
              feedsType,
              setFeedsType,
              socialPlatform,
              setSocialPlatform,

              fcTrendFeeds,
              fcTrendPageInfo,
              fcTrendFirstLoading,
              fcTrendMoreLoading,
              loadFcTrendFirstFeeds,
              loadFcTrendMoreFeeds,
              fcUserDataObj,

              postScroll,
              setPostScroll,

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
    </CommunityLayoutWrapper>
  );
}

function CommunityLayoutWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `w-full h-screen  bg-[#1B1E23] flex flex-col overflow-hidden`,
        className
      )}
      // 特殊处理，宽度 = 屏幕宽度 - 左侧浮动栏宽度 - 右侧浮动栏宽度
      style={{
        width: 'calc(100vw - 60px - 30px)',
        position: 'fixed',
        top: 0,
        left: '60px',
      }}
      {...props}
    />
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
