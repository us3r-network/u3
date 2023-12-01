/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-01 16:22:00
 * @Description: 首页任务看板
 */
import { useCallback, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

import LinksPage from 'src/components/news/links/LinksPage';
import LinksPageMobile from 'src/components/news/links/mobile/LinksPageMobile';
import useLinksSearchParams from 'src/hooks/news/useLinksSearchParams';

import useFeedLinks from 'src/hooks/news/useFeedLinks';
import { useParams } from 'react-router-dom';
import { LinkGroup } from 'src/components/news/header/NewsMenu';

function Links() {
  const { group } = useParams();
  const { currentSearchParams, searchParamsChange } = useLinksSearchParams();
  const { loading, hasMore, links, load, loadMore } = useFeedLinks();

  useEffect(() => {
    const linkGroup = LinkGroup.find((item) => item.group === group);
    const groupDomain = {
      includeDomains: linkGroup?.includeDomains,
    };
    load(groupDomain, currentSearchParams);
  }, [group, currentSearchParams]);

  const getMore = useCallback(() => {
    if (loading) return;
    if (!hasMore) return;
    const linkGroup = LinkGroup.find((item) => item.group === group);
    const groupDomain = {
      includeDomains: linkGroup?.includeDomains,
    };
    loadMore(groupDomain, currentSearchParams);
  }, [hasMore, load, loading, currentSearchParams, group]);

  return isMobile ? (
    <LinksPageMobile
      loading={loading}
      hasMore={hasMore}
      links={links}
      getMore={getMore}
    />
  ) : (
    <LinksPage
      loading={loading}
      hasMore={hasMore}
      links={links}
      currentSearchParams={currentSearchParams}
      searchParamsChange={searchParamsChange}
      getMore={getMore}
    />
  );
}
export default Links;
