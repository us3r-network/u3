/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-21 18:38:19
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-22 16:56:13
 * @FilePath: /u3/apps/u3/src/hooks/news/useLinks.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { debounce, throttle, unionBy } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { fetchLinks } from 'src/services/news/api/links';
import { LinkListItem } from 'src/services/news/types/links';
import useLogin from 'src/hooks/shared/useLogin';
import { getFarcasterEmbedMetadata } from 'src/services/social/api/farcaster';
import { messages } from 'src/utils/shared/message';

export default function useFeedLinks(currentSearchParams) {
  const { user } = useLogin();
  const [links, setLinks] = useState<Array<LinkListItem>>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [endCursor, setEndCursor] = useState('');

  const load = useCallback(async () => {
    console.log('load links function called', loading);
    if (loading) return;
    // console.log('currentSearchParams: ', currentSearchParams);
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
      const newLinks = processLinks(data.data.data);
      const res = await getFarcasterEmbedMetadata(newLinks.map((l) => l.url));
      const { metadata: metadatas } = res.data.data;
      newLinks.forEach((item, index) => {
        const metadata = metadatas[index];
        item.metadata =
          metadata && metadata.title ? processMetadata(metadata) : null;
        item.supportIframe = true;
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
  }, [links, endCursor]);

  useEffect(() => {
    setEndCursor('');
    throttle(load, 500)();
  }, []);

  return { links, loading, hasMore, endCursor, load };
}

function processLinks(links) {
  return links.map((link) => {
    const url = link.url
      // .replace('https://twitter.com', 'https://x.com')
      .split('?')[0];
    return {
      ...link,
      url,
    };
  });
}

function processMetadata(metadata) {
  if (metadata.twitter)
    metadata.title = `${metadata.title}: ${metadata.description}`;
  return metadata;
}
