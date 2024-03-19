import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFeedLinks from '@/hooks/news/useFeedLinks';
import useLinksSearchParams from '@/hooks/news/useLinksSearchParams';
import LinkModal from '@/components/news/links/LinkModal';
import CommunityLinks from '@/components/news/links/community/CommunityLinks';
import { getExploreFcPostDetailPath } from '@/route/path';

export default function PostsMentionedLinks() {
  const navigate = useNavigate();
  const domains = []; // todo: 目前暂定为全部，以后从参数获取
  const { currentSearchParams } = useLinksSearchParams();
  const { loading, moreLoading, hasMore, links, load, loadMore } =
    useFeedLinks();
  const [selectLink, setSelectLink] = useState(null);
  useEffect(() => {
    const groupDomain = {
      includeDomains: domains,
    };
    load(groupDomain, [], currentSearchParams);
    // debounce(
    //   () => load(groupDomain, [channel.parent_url], currentSearchParams, link),
    //   200
    // );
  }, [currentSearchParams]);

  const getMore = useCallback(() => {
    if (moreLoading) return;
    if (!hasMore) return;
    const groupDomain = {
      includeDomains: domains,
    };
    loadMore(groupDomain, [], currentSearchParams);
  }, [hasMore, loadMore, moreLoading, currentSearchParams]);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="mt-[20px]">
        <h3 className="text-[#718096] text-[14px] font-medium px-[20px] box-border">
          🔗 Mentioned Links
        </h3>
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
          isV2Layout
          castClickAction={(e, castHex) => {
            setSelectLink(null);
            navigate(getExploreFcPostDetailPath(castHex));
          }}
        />
      </div>
    </div>
  );
}
