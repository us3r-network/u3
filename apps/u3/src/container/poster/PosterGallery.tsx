import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loading from '@/components/common/loading/Loading';
import GalleryItem from '@/components/poster/gallery/GalleryItem';
import { fetchPosterList } from '@/services/poster/api/poster';
import { PosterPageInfo } from '@/services/poster/types/poster';

const PAGE_SIZE = 16;

export default function PosterGallery() {
  const [posters, setPosters] = useState([]);
  const [pageInfo, setPageInfo] = useState<PosterPageInfo>({
    hasNextPage: true,
  });
  const [loading, setLoading] = useState(false);
  const loadFirst = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosterList({
        pageSize: PAGE_SIZE,
      });
      const data = res.data?.data;
      setPageInfo(data.pageInfo);
      setPosters(data.posters);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);
  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetchPosterList({
        pageSize: PAGE_SIZE,
        endCursor: pageInfo.endCursor,
      });
      const data = res.data?.data;
      setPageInfo(data.pageInfo);
      setPosters((prev) => [...prev, ...data.posters]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageInfo, loading]);
  useEffect(() => {
    loadFirst();
  }, [loadFirst]);

  return (
    <div
      className="w-full h-full p-[20px] box-border overflow-y-auto"
      id="poster-gallery-scroll"
    >
      {posters.length === 0 && loading ? (
        <div className="w-full h-[calc(100vh-72px)] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <InfiniteScroll
          style={{ overflow: 'hidden', paddingBottom: '30px' }}
          dataLength={posters.length}
          next={() => {
            if (loading) return;
            if (!pageInfo.hasNextPage) return;
            loadMore();
          }}
          hasMore={pageInfo.hasNextPage}
          loader={
            <div className="flex justify-center mt-[30px]">
              <Loading />
            </div>
          }
          scrollableTarget="poster-gallery-scroll"
        >
          <div className="grid grid-cols-4 gap-[30px] max-lg:grid-cols-2 max-md:grid-cols-1">
            {posters.map((item) => {
              return <GalleryItem key={item.tokenId} data={item} />;
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
