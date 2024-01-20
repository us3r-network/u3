/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-21 18:38:19
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 17:17:10
 * @FilePath: /u3/apps/u3/src/hooks/news/useLinks.ts
 * @Description:
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
const defaultLinkURLHash = ':link';

const getLinks = async ({
  domains,
  currentSearchParams,
  link,
  endCursor,
  token,
}: {
  domains: LinkDomians;
  currentSearchParams: any;
  link: string;
  endCursor: string;
  token: string;
}) => {
  const { keywords, orderBy } = currentSearchParams;
  const { data } = await fetchLinks(
    {
      keywords: keywords.split(' ') || [],
      includeDomains: domains.includeDomains || [],
      excludeDomains: domains.excludeDomains || [],
      urls: link === defaultLinkURLHash ? [] : [link],
      orderBy,
      endCursor,
    },
    token
  );
  const newLinks = data.data.data;
  newLinks.forEach((item) => {
    item.metadata =
      item.metadata && item.metadata.title
        ? processMetadata(item.metadata)
        : null;
  });
  const { pageInfo } = data.data;
  return {
    newLinks: newLinks.filter((l) => l.metadata && l.metadata?.title),
    pageInfo,
  };
};

export default function useFeedLinks() {
  const { user } = useLogin();
  const { token } = user || {};
  const [links, setLinks] = useState<Array<LinkListItem>>([]);
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState('');
  const loadMore = useCallback(
    async (
      domains = defaultLinkDomians,
      currentSearchParams = defaultLinkSearchParams,
      link = defaultLinkURLHash
    ) => {
      if (loading || moreLoading) return;
      try {
        setMoreLoading(true);
        const { newLinks, pageInfo } = await getLinks({
          domains,
          currentSearchParams,
          link,
          endCursor,
          token,
        });
        setLinks(unionBy(links, newLinks, (l) => l.url));
        setEndCursor(pageInfo.endFarcasterCursor);
        setHasMore(pageInfo.hasNextPage);
      } catch (error) {
        console.error(error.message || messages.common.error);
        setHasMore(false);
      } finally {
        setMoreLoading(false);
      }
    },
    [links, endCursor, token, loading, moreLoading]
  );

  const load = useCallback(
    async (
      domains = defaultLinkDomians,
      currentSearchParams = defaultLinkSearchParams,
      link = defaultLinkURLHash
    ) => {
      setEndCursor('');
      try {
        setLoading(true);
        const { newLinks, pageInfo } = await getLinks({
          domains,
          currentSearchParams,
          link,
          endCursor: '',
          token,
        });
        setLinks(unionBy([], newLinks, (l) => l.url));
        setEndCursor(pageInfo.endFarcasterCursor);
        setHasMore(pageInfo.hasNextPage);
      } catch (error) {
        console.error(error.message || messages.common.error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { links, loading, moreLoading, hasMore, endCursor, load, loadMore };
}
