/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-21 18:47:15
 * @Description: 首页任务看板
 */
import { useCallback } from 'react';
import { isMobile } from 'react-device-detect';

import LinksPage from 'src/components/news/links/LinksPage';
import LinksPageMobile from 'src/components/news/links/mobile/LinksPageMobile';
import useLinksSearchParams from 'src/hooks/news/useLinksSearchParams';

import useFeedLinks from 'src/hooks/news/useFeedLinks';

function Links() {
  const { currentSearchParams, searchParamsChange } = useLinksSearchParams();
  const { loading, hasMore, links, load } = useFeedLinks(currentSearchParams);

  const getMore = useCallback(() => {
    if (loading) return;
    if (!hasMore) return;
    load();
  }, [hasMore, load, loading]);

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
