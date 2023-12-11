/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:36:42
 * @FilePath: /u3/apps/u3/src/container/social/SocialFarcasterTrending.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useFarcasterTrending from 'src/hooks/social/farcaster/useFarcasterTrending';
import { EndMsgContainer, LoadingMoreWrapper, PostList } from './CommonStyles';

export default function SocialFarcasterTrending() {
  const [parentId] = useState('social-farcaster-trending');
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>();
  const { mounted } = useListScroll(parentId);

  const {
    loading: farcasterTrendingLoading,
    farcasterTrending,
    farcasterTrendingUserDataObj,
    loadFarcasterTrending,
    pageInfo: farcasterTrendingPageInfo,
  } = useFarcasterTrending();

  useEffect(() => {
    if (mounted) {
      loadFarcasterTrending();
    }
  }, [mounted]);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={farcasterTrending.length}
      next={() => {
        if (farcasterTrendingLoading) return;
        loadFarcasterTrending();
      }}
      hasMore={farcasterTrendingPageInfo.hasNextPage}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {farcasterTrending.map(({ platform, data }) => {
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={farcasterTrendingUserDataObj}
                showMenuBtn
                cardClickAction={(e) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: key,
                    top: (e.target as HTMLDivElement).offsetTop,
                  });
                }}
              />
            );
          }
          return null;
        })}
      </PostList>
    </InfiniteScroll>
  );
}
