/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:30:33
 * @FilePath: /u3/apps/u3/src/container/social/SocialAllFollowing.tsx
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
import useAllFollowing from 'src/hooks/social/useAllFollowing';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import { LoadingMoreWrapper, PostList } from './CommonStyles';

export default function SocialAllFollowing() {
  const [parentId] = useState('social-all-following');
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);

  const { allFollowing, loadAllFollowing, loading, pageInfo, allUserDataObj } =
    useAllFollowing();

  useEffect(() => {
    if (!mounted) return;
    loadAllFollowing();
  }, [loadAllFollowing, mounted]);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={allFollowing.length}
      next={() => {
        if (loading) return;
        loadAllFollowing();
      }}
      hasMore={pageInfo.hasNextPage || true}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {allFollowing.map(({ platform, data }) => {
          if (platform === 'lens') {
            return (
              <LensPostCard
                key={data.id}
                data={data}
                cardClickAction={(e) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: data.id,
                    top: (e.target as HTMLDivElement).offsetTop,
                  });
                }}
              />
            );
          }
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={allUserDataObj}
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
