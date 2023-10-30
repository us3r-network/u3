import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useActiveProfile } from '@lens-protocol/react-web';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLoadProfileFeeds } from '../../hooks/social/useLoadProfileFeeds';
import Loading from '../common/loading/Loading';
import LensPostCard from '../social/lens/LensPostCard';
import FCast from '../social/farcaster/FCast';
import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { ProfileFeedsGroups } from '../../services/social/api/feeds';
import {
  LensComment,
  LensMirror,
  LensPost,
} from '../../services/social/api/lens';
import Rss3Content from '../fren/Rss3Content';
import { NoActivity } from '../../container/Activity';

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
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();

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
      activeLensProfileId: activeLensProfile?.id,
      lensProfileId,
      fid,
      group,
    });
  }, [loadFirstFeeds, activeLensProfile?.id, fid, group, lensProfileId]);

  const loadMoreSocialFeeds = useCallback(() => {
    loadMoreFeeds({
      activeLensProfileId: activeLensProfile?.id,
      lensProfileId,
      fid,
      group,
    });
  }, [loadMoreFeeds, activeLensProfile?.id, fid, group, lensProfileId]);

  useEffect(() => {
    if (activeLensProfileLoading) return;
    loadFirstSocialFeeds();
  }, [activeLensProfileLoading, loadFirstSocialFeeds]);

  return (
    <MainCenter>
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
            scrollableTarget="profile-wrapper"
          >
            <PostList>
              {feeds.map(({ platform, data }) => {
                if (platform === 'lens') {
                  let d;
                  switch (group) {
                    case ProfileFeedsGroups.POSTS:
                      d = data as LensPost;
                      break;
                    case ProfileFeedsGroups.REPOSTS:
                      d = (data as LensMirror).mirrorOf;
                      break;
                    case ProfileFeedsGroups.REPLIES:
                      d = (data as LensComment).commentOn;
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
export function ProfileSocialActivity({ address }: { address: string }) {
  return (
    <MainCenter>
      <Rss3Content
        address={[address]}
        empty={
          <NoActivityWrapper>
            <NoActivity />
          </NoActivityWrapper>
        }
      />
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
const NoActivityWrapper = styled.div`
  .no-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
