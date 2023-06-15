/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-07 15:41:38
 * @Description: 首页任务看板
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { fetchContents } from '../services/api/contents';
import { ContentLang, ContentListItem } from '../services/types/contents';
import useContentHandles from '../hooks/useContentHandles';
import useAdminContentHandles from '../hooks/useAdminContentHandles';
import { messages } from '../utils/message';
import ContentsPage from '../components/contents/ContentsPage';
import ContentsPageMobile from '../components/contents/ContentsPageMobile';
import useContentsSearchParams from '../hooks/useContentsSearchParams';
import useLogin from '../hooks/useLogin';

const NEWEST_CONTENT_ID_KEY = 'NEWEST_CONTENT_ID';
function getNewestContentIdForStore(): number {
  return Number(localStorage.getItem(NEWEST_CONTENT_ID_KEY));
}

function setNewestContentIdToStore(id: number) {
  localStorage.setItem(NEWEST_CONTENT_ID_KEY, String(id));
}

export type ContentsPageProps = {
  // Queries
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  contents?: Array<ContentListItem>;
  currentSearchParams?: {
    orderBy: any;
    tags: string[];
    lang: string[];
    keywords: string;
  };
  searchParamsChange?: (values: {
    orderBy?: any;
    tags?: string[];
    lang?: string[];
    keywords?: string;
  }) => void;
  hasNewest?: boolean;
  getMore?: () => void;
  // Mutations
  hiddenPendingIds?: (string | number)[];
  onHiddenAction?: (data: ContentListItem) => void;
  onHiddenUndoAction?: (data: ContentListItem) => void;
  onAdminScore?: (data: ContentListItem) => Promise<void>;
  onAdminDelete?: (data: ContentListItem) => Promise<void>;
  // Others
  onShare?: (data: ContentListItem) => void;
};
function Contents() {
  const { user } = useLogin();
  const { id } = useParams();

  const idCache = useRef('');
  useEffect(() => {
    idCache.current = id === ':id' ? '' : id;
  }, [id]);

  const { currentSearchParams, searchParamsChange } = useContentsSearchParams();

  const [currPageNumber, setCurrPageNumber] = useState(0);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [hasNewest, setHasNewest] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const oldId = getNewestContentIdForStore();
        const { data } = await fetchContents({
          orderBy: 'NEWEST',
          pageSize: 1,
          pageNumber: 0,
        });
        if (data.code === 0) {
          const newId = data.data[0]?.id;
          if (newId !== oldId) {
            setHasNewest(true);
          }
          setNewestContentIdToStore(newId);
        }
        // eslint-disable-next-line no-empty
      } catch (error) {}
    })();
  }, []);

  const { hiddenPendingIds, onHiddenAction, onHiddenUndoAction, onShare } =
    useContentHandles(contents, setContents);

  const { onAdminScore, onAdminDelete } = useAdminContentHandles(
    contents,
    setContents
  );

  const fetchData = useCallback(
    async (
      keywords: string,
      tags: string[],
      orderBy: string,
      lang: string[],
      contentId: string
    ) => {
      setLoading(true);
      setContents([]);
      try {
        let tmpData: ContentListItem[] = [];
        const langQuery =
          lang.length === 0 || lang.length === 2 ? ContentLang.All : lang[0];
        const { data } = await fetchContents(
          {
            keywords,
            tags,
            orderBy,
            contentId: contentId ?? '',
            lang: langQuery,
          },
          user?.token
        );
        tmpData = data.data;
        setContents(tmpData);
        if (orderBy === 'NEWEST') {
          setHasNewest(false);
        }
      } catch (error) {
        toast.error(error.message || messages.common.error);
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );
  const loadMore = useCallback(async () => {
    const pageNumber = currPageNumber + 1;
    const { keywords, tags, orderBy, lang } = currentSearchParams;
    const langQuery =
      lang.length === 0 || lang.length === 2 ? ContentLang.All : lang[0];
    try {
      setLoadingMore(true);
      const { data } = await fetchContents(
        { keywords, tags, orderBy, pageNumber, lang: langQuery },
        user?.token
      );
      setHasMore(data.data.length > 0);

      setContents([...contents, ...data.data]);
      setCurrPageNumber(pageNumber);
    } catch (error) {
      toast.error(error.message || messages.common.error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [currentSearchParams, contents, currPageNumber]);

  useEffect(() => {
    const { keywords, tags, orderBy, lang } = currentSearchParams;
    fetchData(keywords, tags, orderBy, lang, idCache.current);
  }, [currentSearchParams]);

  const getMore = useCallback(() => {
    if (loadingMore) return;
    if (!hasMore) return;
    loadMore();
  }, [loadingMore, hasMore, loadMore]);

  return isMobile ? (
    <ContentsPageMobile
      // Queries
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      contents={contents}
      getMore={getMore}
    />
  ) : (
    <ContentsPage
      // Queries
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      contents={contents}
      currentSearchParams={currentSearchParams}
      searchParamsChange={searchParamsChange}
      hasNewest={hasNewest}
      getMore={getMore}
      // Mutations
      hiddenPendingIds={hiddenPendingIds}
      onHiddenAction={onHiddenAction}
      onHiddenUndoAction={onHiddenUndoAction}
      onAdminScore={onAdminScore}
      onAdminDelete={onAdminDelete}
      // Others
      onShare={onShare}
    />
  );
}
export default Contents;
