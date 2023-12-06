import styled from 'styled-components';
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
import { useLensCtx } from 'src/contexts/social/AppLensCtx';

import { NoLoginStyled } from './CommonStyles';
import useLogin from '../../hooks/shared/useLogin';
import FollowingDefault from '../../components/social/FollowingDefault';

export default function SocialAllFollowing() {
  const [parentId] = useState('social-all-following');
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);

  const { allFollowing, loadAllFollowing, loading, pageInfo, allUserDataObj } =
    useAllFollowing();

  useEffect(() => {
    if (!mounted) return;
    if (!isLogin) return;
    if (!isConnectedFarcaster && !lensSessionProfileId) return;
    loadAllFollowing();
  }, [
    loadAllFollowing,
    mounted,
    isLogin,
    isConnectedFarcaster,
    lensSessionProfileId,
  ]);

  if (!isLogin) {
    return <NoLoginStyled />;
  }
  if (!isConnectedFarcaster && !lensSessionProfileId) {
    return (
      <MainCenter>
        <FollowingDefault farcaster lens />
      </MainCenter>
    );
  }

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

const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const MainCenter = styled.div`
  width: 100%;
`;
