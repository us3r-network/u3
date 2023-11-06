import { useActiveProfile } from '@lens-protocol/react-web';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import Loading from 'src/components/common/loading/Loading';
import NoLogin from 'src/components/layout/NoLogin';
import AddPostForm from 'src/components/social/AddPostForm';
import FollowingDefault from 'src/components/social/FollowingDefault';
import { FeedsType } from 'src/components/social/SocialPageNav';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import useLogin from 'src/hooks/shared/useLogin';
import useListFeeds from 'src/hooks/social/useListFeeds';
import useListScroll from 'src/hooks/social/useListScroll';
import { SocialPlatform } from 'src/services/social/types';
import styled from 'styled-components';

export default function SocialFarcaster() {
  const [parentId] = useState('social-lens');
  const { isLogin } = useLogin();

  const [searchParams] = useSearchParams();
  const currentSearchParams = useMemo(
    () => ({
      keyword: searchParams.get('keyword') || '',
    }),
    [searchParams]
  );

  const {
    trendingFeeds,
    followingFeeds,
    feedsType,

    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    followingFirstLoading,
    followingPageInfo,
    followingMoreLoading,

    trendingMoreLoading,
    trendingPageInfo,
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    trendingFirstLoading,

    postScroll,
    setPostScroll,
  } = useOutletContext<any>();

  const { mounted, firstLoadingDone, setFirstLoadingDone } =
    useListScroll(parentId);
  const { feeds, firstLoading, pageInfo, moreLoading } = useListFeeds(parentId);

  const { data: activeLensProfile } = useActiveProfile();
  const { ownedBy: lensProfileOwnedByAddress } = activeLensProfile || {};

  const loadFirstFeeds = useCallback(async () => {
    setFirstLoadingDone(false);
    if (feedsType === FeedsType.FOLLOWING) {
      await loadFollowingFirstFeeds(parentId, {
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
        address: lensProfileOwnedByAddress,
        fid: undefined,
        platforms: SocialPlatform.Lens,
      });
    } else {
      await loadTrendingFirstFeeds(parentId, {
        activeLensProfileId: activeLensProfile?.id,
        keyword: currentSearchParams.keyword,
        platforms: SocialPlatform.Lens,
      });
    }
    setFirstLoadingDone(true);
    return loadFollowingFirstFeeds;
  }, [
    loadFollowingFirstFeeds,
    loadTrendingFirstFeeds,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    lensProfileOwnedByAddress,
    feedsType,
  ]);

  const loadMoreFeeds = useCallback(() => {
    if (feedsType === FeedsType.FOLLOWING) {
      loadFollowingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        address: lensProfileOwnedByAddress,
        fid: undefined,
        platforms: SocialPlatform.Lens,
      });
    } else {
      loadTrendingMoreFeeds(parentId, {
        keyword: currentSearchParams.keyword,
        activeLensProfileId: activeLensProfile?.id,
        platforms: SocialPlatform.Lens,
      });
    }
  }, [
    loadFollowingMoreFeeds,
    loadTrendingMoreFeeds,
    activeLensProfile?.id,
    currentSearchParams.keyword,
    lensProfileOwnedByAddress,
    feedsType,
  ]);

  useEffect(() => {
    if (firstLoadingDone) return;
    if (feeds.length > 0) return;
    if (!mounted) return;
    console.log('loadFirstFeeds', Date.now());
    loadFirstFeeds();
  }, [loadFirstFeeds, feeds, mounted, firstLoadingDone]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!lensProfileOwnedByAddress) {
      return (
        <MainCenter>
          <FollowingDefault lens />
        </MainCenter>
      );
    }
  }

  return (
    <LensListBox>
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>
      {(firstLoading && (
        <LoadingWrapper>
          <Loading />
        </LoadingWrapper>
      )) || (
        <InfiniteScroll
          style={{ overflow: 'hidden' }}
          dataLength={feeds.length}
          next={() => {
            if (moreLoading) return;
            loadMoreFeeds();
          }}
          hasMore={!firstLoading && pageInfo?.hasNextPage}
          loader={
            <LoadingMoreWrapper>
              <Loading />
            </LoadingMoreWrapper>
          }
          scrollThreshold="1000px"
          scrollableTarget="social-scroll-wrapper"
        >
          <PostList>
            {feeds.map(({ platform, data }) => {
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
              return null;
            })}
          </PostList>
        </InfiniteScroll>
      )}
    </LensListBox>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;

const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;

const LensListBox = styled.div``;

const AddPostFormWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
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

const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
