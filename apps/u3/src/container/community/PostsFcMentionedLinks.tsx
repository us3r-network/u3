import { useEffect, useCallback, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import useFeedLinks from '@/hooks/news/useFeedLinks';
import useLinksSearchParams from '@/hooks/news/useLinksSearchParams';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import LinkModal from '@/components/news/links/LinkModal';
import CommunityLinks from '@/components/news/links/community/CommunityLinks';

export default function PostsFcMentionedLinks() {
  const communityContext = useOutletContext<any>();
  // 可以在这个组件根据这个channelId查询，也可以在上层context里查询，数据从communityContext里传递下来
  // 可参考MembersLayout 里的 TotalMembers 组件
  const { channelId } = communityContext;
  const { getChannelFromId } = useFarcasterCtx();
  const channel = useMemo(
    () => getChannelFromId(channelId),
    [channelId, getChannelFromId]
  );
  const domains = []; // todo: 目前暂定为全部，以后从参数获取
  const { currentSearchParams } = useLinksSearchParams();
  const { loading, moreLoading, hasMore, links, load, loadMore } =
    useFeedLinks();
  const [selectLink, setSelectLink] = useState(null);
  useEffect(() => {
    if (!channel) return;
    const groupDomain = {
      includeDomains: domains,
    };
    console.log('channel', channel);
    load(groupDomain, [channel.parent_url], currentSearchParams);
    // debounce(
    //   () => load(groupDomain, [channel.parent_url], currentSearchParams, link),
    //   200
    // );
  }, [channel, currentSearchParams]);

  const getMore = useCallback(() => {
    if (moreLoading) return;
    if (!hasMore) return;
    const groupDomain = {
      includeDomains: domains,
    };
    loadMore(groupDomain, [channel.parent_url], currentSearchParams);
  }, [hasMore, loadMore, moreLoading, currentSearchParams, channel]);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="text-[#fff] text-[16px] mt-[20px] text-center">
        <h3>Mentioned Links</h3>
        {links && links.length > 0 && (
          <CommunityLinks
            loading={loading}
            hasMore={hasMore}
            links={links}
            getMore={getMore}
            quickView={(link) => {
              console.log('quickView', link);
              setSelectLink(link);
            }}
          />
        )}
        <LinkModal
          show={selectLink}
          closeModal={() => {
            setSelectLink(null);
          }}
          data={selectLink}
        />
      </div>
    </div>
  );
}
