import { SortDirection, TokenSortKey, ZDK } from '@zoralabs/zdk';
import { useCallback, useEffect, useState } from 'react';
import {
  PageInfo,
  PaginationInput,
} from '@zoralabs/zdk/dist/queries/queries-sdk';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  ZORA_API_ENDPOINT,
  casterZora1155ToMintAddress,
  casterZoraNetworkInfo,
} from '@/constants/zora';
import Loading from '@/components/common/loading/Loading';
import GalleryItem from '@/components/poster/gallery/GalleryItem';

const args = {
  endPoint: ZORA_API_ENDPOINT,
  networks: [casterZoraNetworkInfo],
};
const zdk = new ZDK(args);

async function fetchTokensAndFormatData({
  pagination,
}: {
  pagination?: PaginationInput;
}) {
  const res = await zdk.tokens({
    where: {
      collectionAddresses: [casterZora1155ToMintAddress],
    },
    sort: {
      sortDirection: 'DESC' as SortDirection.Desc,
      sortKey: 'TOKEN_ID' as TokenSortKey.TokenId,
    },
    includeFullDetails: true,
    includeSalesHistory: true,
    pagination,
  });

  // TODO zdk的排序参数设定后排序是乱的，这里手动排下序
  const tokens = res.tokens.nodes
    .map((node) => node.token)
    .sort((a, b) => {
      return Number(b.tokenId) - Number(a.tokenId);
    });
  return {
    pageInfo: res.tokens.pageInfo,
    tokens,
  };
}

// TODO zdk的排序参数设定后排序是乱的，为了在前端可以得到正常的排序，前期先不做分页（分页调大些），后期看zdk是否修复这个bug
const PAGE_SIZE = 100;

export default function PosterGallery() {
  const [tokens, setTokens] = useState([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    endCursor: '',
    hasNextPage: true,
    limit: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const loadFirst = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTokensAndFormatData({
        pagination: {
          limit: PAGE_SIZE,
        },
      });
      setPageInfo(data.pageInfo);
      setTokens(data.tokens);
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
      const data = await fetchTokensAndFormatData({
        pagination: {
          after: pageInfo.endCursor,
          limit: pageInfo.limit,
        },
      });
      setPageInfo(data.pageInfo);
      setTokens((prev) => [...prev, ...data.tokens]);
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
    <div className="w-full">
      <div
        className="
          w-full
          h-[72px]
          leading-[72px]
          mb-[20px]
        text-white
          text-[24px]
          italic
          font-bold
          [border-bottom:1px_solid_#39424C]
      "
      >
        Poster Gallery
      </div>
      {tokens.length === 0 && loading ? (
        <div className="w-full h-[calc(100vh-72px)] flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <InfiniteScroll
          style={{ overflow: 'hidden', paddingBottom: '30px' }}
          dataLength={tokens.length}
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
          scrollableTarget="layout-main-wrapper"
        >
          <div className="grid grid-cols-4 gap-[30px]">
            {tokens.map((item) => {
              return <GalleryItem key={item.tokenId} data={item} />;
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
