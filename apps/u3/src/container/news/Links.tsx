/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-17 18:09:31
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { fetchLinks } from 'src/services/news/api/links';
import { LinkListItem } from 'src/services/news/types/links';
import { messages } from 'src/utils/shared/message';
import LinksPage from 'src/components/news/links/LinksPage';
import LinksPageMobile from 'src/components/news/links/mobile/LinksPageMobile';
import useLinksSearchParams from 'src/hooks/news/useLinksSearchParams';
import useLogin from 'src/hooks/shared/useLogin';
import { getFarcasterEmbedMetadata } from 'src/services/social/api/farcaster';

function Links() {
  const { user } = useLogin();
  // const { link } = useParams();
  // console.log({ link });
  // const linkCache = useRef('');
  // useEffect(() => {
  //   linkCache.current = link === ':link' ? '' : link;
  // }, [link]);

  const { currentSearchParams, searchParamsChange } = useLinksSearchParams();

  const [links, setLinks] = useState<Array<LinkListItem>>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState('');

  const load = useCallback(async () => {
    console.log('currentSearchParams: ', currentSearchParams);
    const { keywords, channels, includeDomains, excludeDomains, orderBy } =
      currentSearchParams;
    try {
      setLoading(true);
      const { data } = await fetchLinks(
        {
          keywords,
          channels,
          includeDomains,
          excludeDomains,
          orderBy,
          endCursor,
        },
        user?.token
      );
      const newLinks = data.data.data;
      const res = await getFarcasterEmbedMetadata(newLinks.map((l) => l.url));
      const { metadata: metadatas } = res.data.data;
      // console.log(newLinks, metadatas);
      newLinks.forEach((l) => {
        const metadata = metadatas.find((m) => m?.url === l?.url);
        l.metadata = metadata;
        l.supportIframe = true;
      });
      setLinks(
        Array.from(
          new Set([
            ...links,
            ...newLinks.filter((l) => l.metadata && l.metadata?.title),
          ])
        )
      );
      setEndCursor(data.data.pageInfo.endCursor);
      setHasMore(data.data.pageInfo.hasNextPage);
    } catch (error) {
      console.error(error.message || messages.common.error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentSearchParams, links, endCursor]);

  useEffect(() => {
    setEndCursor('');
    load();
  }, [currentSearchParams]);

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
