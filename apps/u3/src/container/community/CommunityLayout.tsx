import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import useFcTrendFeeds from 'src/hooks/social/useChannelFeeds';
import { FeedsType } from '../../components/social/SocialPageNav';
import { SocialPlatform } from '../../services/social/types';
import { cn } from '@/lib/utils';
import CommunityMenu from './CommunityMenu';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import Loading from '@/components/common/loading/Loading';
import useLoadCommunityMembers from '@/hooks/community/useLoadCommunityMembers';
import useLoadCommunityTopMembers from '@/hooks/community/useLoadCommunityTopMembers';
import { CommunityInfo } from '@/services/community/types/community';

export default function CommunityLayout() {
  const [joined, setJoined] = useState(false);
  const [communityInfo, setCommunityInfo] = useState<CommunityInfo | null>();
  const [postScroll, setPostScroll] = useState({
    currentParent: '',
    id: '',
    top: 0,
  });
  const { farcasterChannels, farcasterChannelsLoading } = useFarcasterCtx();
  const { channelId } = useParams();
  const channel = farcasterChannels.find((c) => c.channel_id === channelId);

  // mock community info
  useEffect(
    () =>
      setCommunityInfo({
        id: channel?.channel_id as unknown as number,
        name: channel?.name,
        image: channel?.image,
        description: 'Not financial advice',
        types: ['Token', 'NFT', 'App'],
        postsCount: 100,
        membersCount: 1000,
        token: {
          contract: '0xe55ae417f6e5ab84b94273ef64b6b9ee35ee0a58',
          url: 'https://api-dev.u3.xyz/poster-frame/mint/1',
        },
        nft: {
          contract: '0xe55ae417f6e5ab84b94273ef64b6b9ee35ee0a58',
          url: 'https://api-dev.u3.xyz/poster-frame/mint/2',
        },
        point: {
          contract: '0xe55ae417f6e5ab84b94273ef64b6b9ee35ee0a58',
          url: 'https://api-dev.u3.xyz/poster-frame/mint/3',
        },
        dapps: [
          {
            id: 1,
            name: 'Dapp1',
            logo: 'https://via.placeholder.com/150',
            url: 'https://chainlist.org/',
          },
          {
            id: 2,
            name: 'Dapp2',
            logo: 'https://via.placeholder.com/150',
            url: 'https://chainlist.org/',
          },
          {
            id: 3,
            name: 'Dapp3',
            logo: 'https://via.placeholder.com/150',
            url: 'https://chainlist.org/',
          },
        ],
      }),
    [channel]
  );

  // posts state
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

  // TODO links state

  console.log('channel', channel);
  console.log('farcasterChannels', farcasterChannels);

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform | ''>('');

  if (farcasterChannelsLoading) {
    <CommunityLayoutWrapper className="flex justify-center items-center">
      <Loading />
    </CommunityLayoutWrapper>;
  }

  if (!channel?.channel_id) {
    return null;
  }
  return (
    <CommunityLayoutWrapper>
      {!joined && (
        <GuestModeHeader
          joinAction={() => {
            setJoined(true);
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
  ...props
}: ComponentPropsWithRef<'div'> & {
  joined?: boolean;
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
        Join the community
      </button>
      {/* <Button className="px-[12px] h-[22px] box-border rounded-[4px] border-[1px] border-solid border-[#FFF] text-[#FFF] text-[12px] font-normal">
        Mint NFT & Add to Shortcut
      </Button> */}
    </div>
  );
}
