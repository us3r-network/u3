/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-21 18:38:19
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-05 11:12:29
 * @FilePath: /u3/apps/u3/src/hooks/news/useLinks.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { unionBy } from 'lodash';
import { useCallback, useState } from 'react';
import { fetchLinks } from 'src/services/news/api/links';
import { LinkListItem } from 'src/services/news/types/links';
import useLogin from 'src/hooks/shared/useLogin';
import { messages } from 'src/utils/shared/message';
import { processMetadata } from 'src/utils/news/link';
import { defaultLinkSearchParams } from './useLinksSearchParams';

type LinkDomians = {
  includeDomains?: string[];
  excludeDomains?: string[];
};
const defaultLinkDomians: LinkDomians = {
  includeDomains: [],
  excludeDomains: [],
};
export default function useFeedLinks() {
  const { user } = useLogin();
  const [links, setLinks] = useState<Array<LinkListItem>>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState('');
  const loadMore = useCallback(
    async (
      domains = defaultLinkDomians,
      currentSearchParams = defaultLinkSearchParams
    ) => {
      if (loading) return;
      // console.log('currentSearchParams: ', currentSearchParams);
      const { keywords, orderBy } = currentSearchParams;
      console.log('keywords: ', keywords);
      try {
        setLoading(true);
        const { data } = await fetchLinks(
          {
            keywords: keywords.split(' ') || [],
            includeDomains: domains.includeDomains || [],
            excludeDomains: domains.excludeDomains || [],
            orderBy,
            endCursor,
          },
          user?.token
        );
        const newLinks = data.data.data;
        newLinks.forEach((item) => {
          item.metadata =
            item.metadata && item.metadata.title
              ? processMetadata(item.metadata)
              : null;
          item.supportIframe = checkSupportIframe(item.url);
        });
        setLinks(
          unionBy(
            links,
            newLinks.filter((l) => l.metadata && l.metadata?.title),
            (l) => l.url
          )
        );
        setEndCursor(data.data.pageInfo.endFarcasterCursor);
        setHasMore(data.data.pageInfo.hasNextPage);
      } catch (error) {
        console.error(error.message || messages.common.error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [links, endCursor]
  );

  const load = useCallback(
    (
      domains = defaultLinkDomians,
      currentSearchParams = defaultLinkSearchParams
    ) => {
      setEndCursor('');
      loadMore(domains, currentSearchParams);
    },
    []
  );

  return { links, loading, hasMore, endCursor, load, loadMore };
}

const DOMAINS_DO_NOT_SUPPORT_IFRAME = ['substack.com', 'github.com'];
function checkSupportIframe(url) {
  const domain = url.split('/')[2];
  let support = true;
  DOMAINS_DO_NOT_SUPPORT_IFRAME.forEach((item) => {
    if (domain.indexOf(item) >= 0) support = false;
  });
  return support;
}
