import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import Loading from 'src/components/common/loading/Loading';
import FCast from 'src/components/social/farcaster/FCast';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useAllWhatsnew from 'src/hooks/social/useAllWhatsnew';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import styled from 'styled-components';

export default function SocialAllWhatsnew() {
  const [parentId] = useState('social-all-whatsnew');
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>();

  const { mounted } = useListScroll(parentId);
  const {
    loading,
    loadAllWhatsnew,
    allWhatsnew,
    allUserData,
    allUserDataObj,
    pageInfo,
  } = useAllWhatsnew();

  useEffect(() => {
    if (mounted) {
      loadAllWhatsnew();
    }
  }, [mounted, loadAllWhatsnew]);

  const hasMore =
    pageInfo?.hasNextPage !== undefined ? pageInfo?.hasNextPage : true;

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={allWhatsnew.length}
      next={() => {
        if (loading) return;
        loadAllWhatsnew();
      }}
      hasMore={hasMore}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {(allWhatsnew || []).map(({ platform, data }) => {
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
                farcasterUserData={allUserData}
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

const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  background: #212228;
  overflow: hidden;
  & > * {
    border-top: 1px solid #718096;
  }
`;
