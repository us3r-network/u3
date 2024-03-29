import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { Comment, Mirror, Post, useSession } from '@lens-protocol/react-web';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLoadProfileFeeds } from '../../hooks/social/useLoadProfileFeeds';
import Loading from '../common/loading/Loading';
import LensPostCard from '../social/lens/LensPostCard';
import FCast from '../social/farcaster/FCast';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { ProfileFeedsGroups } from '../../services/social/api/feeds';
import { EndMsgContainer } from '../social/CommonStyles';

export function ProfileSocialPosts({
  lensProfileId,
  fid,
  group,
}: {
  lensProfileId: string;
  fid: string;
  group: ProfileFeedsGroups;
}) {
  const { openFarcasterQR, farcasterUserData } = useFarcasterCtx();
  const { loading: activeLensProfileLoading } = useSession();

  const {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  } = useLoadProfileFeeds();

  const loadFirstSocialFeeds = useCallback(() => {
    loadFirstFeeds({
      lensProfileId,
      fid,
      group,
    });
  }, [loadFirstFeeds, fid, group, lensProfileId]);

  const loadMoreSocialFeeds = useCallback(() => {
    loadMoreFeeds({
      lensProfileId,
      fid,
      group,
    });
  }, [loadMoreFeeds, fid, group, lensProfileId]);

  useEffect(() => {
    if (activeLensProfileLoading) return;
    loadFirstSocialFeeds();
  }, [activeLensProfileLoading, loadFirstSocialFeeds]);

  return (
    <MainCenter id="posts-warper" className="h-full overflow-auto">
      {(() => {
        if (firstLoading) {
          return (
            <LoadingWrapper>
              <Loading />
            </LoadingWrapper>
          );
        }

        return (
          <InfiniteScroll
            dataLength={feeds.length}
            next={() => {
              if (moreLoading) return;
              loadMoreSocialFeeds();
            }}
            hasMore={!firstLoading && pageInfo.hasNextPage}
            loader={
              moreLoading ? (
                <LoadingMoreWrapper>
                  <Loading />
                </LoadingMoreWrapper>
              ) : null
            }
            endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
            scrollThreshold="5000px"
            scrollableTarget="posts-warper"
          >
            <PostList>
              {feeds.map(({ platform, data }) => {
                if (platform === 'lens') {
                  let d;
                  switch (group) {
                    case ProfileFeedsGroups.POSTS:
                      d = data as Post;
                      break;
                    case ProfileFeedsGroups.REPOSTS:
                      d = (data as Mirror).mirrorOn;
                      break;
                    case ProfileFeedsGroups.REPLIES:
                      d = (data as Comment).commentOn;
                      break;
                    default:
                      break;
                  }
                  if (!d) return null;
                  return <LensPostCard key={d.id} data={d} />;
                }
                if (platform === 'farcaster') {
                  const key = Buffer.from(data.hash.data).toString('hex');
                  return (
                    <FCast
                      isV2Layout
                      key={key}
                      cast={data}
                      openFarcasterQR={openFarcasterQR}
                      farcasterUserData={farcasterUserData}
                    />
                  );
                }
                return null;
              })}
            </PostList>
          </InfiniteScroll>
        );
      })()}
    </MainCenter>
  );
}

const MainCenter = styled.div`
  width: 100%;
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
const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  border-radius: 20px;
  /* border-top-right-radius: 0;
  border-top-left-radius: 0; */
  background: #212228;
  overflow: hidden;
  & > *:not(:first-child) {
    border-top: 1px solid #718096;
  }
`;
