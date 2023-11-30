import styled from 'styled-components';
import { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

// import LensPostCard from 'src/components/social/lens/LensPostCard';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import { SocialPlatform } from 'src/services/social/types';
import { useLoadLinkFeeds } from 'src/hooks/social/useLoadLinkFeeds';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import { useGlobalModalsCtx } from 'src/contexts/shared/GlobalModalsCtx';
import IconSend from 'src/components/common/icons/IconSend';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';

export default function LinkPost({ url }: { url: string }) {
  const {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  } = useLoadLinkFeeds();
  const {
    openFarcasterQR,
    farcasterUserData,
    isConnected: isConnectedFarcaster,
  } = useFarcasterCtx();

  useEffect(() => {
    loadFirstFeeds(url);
  }, [url]);
  const { openCommentLinkModal } = useGlobalModalsCtx();
  return (
    <Wraper>
      <Title>Comments</Title>

      <ListWraper id="link-social-scroll-wrapper">
        {(firstLoading && (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        )) || (
          <InfiniteScroll
            style={{ overflow: 'hidden' }}
            dataLength={feeds?.length || 0}
            next={() => {
              console.log({ moreLoading });
              if (moreLoading) return;
              loadMoreFeeds(url);
            }}
            hasMore={!firstLoading && pageInfo?.hasNextPage}
            scrollThreshold={FEEDS_SCROLL_THRESHOLD}
            loader={
              <LoadingMoreWrapper>
                <Loading />
              </LoadingMoreWrapper>
            }
            scrollableTarget="link-social-scroll-wrapper"
          >
            <PostList>
              {(feeds || []).map(({ platform, data }) => {
                switch (platform) {
                  case SocialPlatform.Farcaster:
                    return (
                      <ItemWraper key={data.id}>
                        <FCast
                          cast={data}
                          disableRenderUrl
                          simpleLayout
                          openFarcasterQR={openFarcasterQR}
                          farcasterUserData={farcasterUserData}
                        />
                      </ItemWraper>
                    );
                  // case SocialPlatform.Lens:
                  //   return (
                  //     <ItemWraper key={data.id}>
                  //       <LensPostCard data={data} />
                  //     </ItemWraper>
                  //   );
                  default:
                    return null;
                }
              })}
            </PostList>
          </InfiniteScroll>
        )}
      </ListWraper>
      <CommentButton
        onClick={() => {
          if (!isConnectedFarcaster || !farcasterUserData) {
            openFarcasterQR();
            return;
          }
          openCommentLinkModal({
            link: url,
            platform: SocialPlatform.Farcaster,
          });
        }}
      >
        <IconSend />
        Give a Comment
      </CommentButton>
    </Wraper>
  );
}

const Wraper = styled.div`
  width: 360px;
  height: 100%;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;
const ListWraper = styled.div`
  width: 100%;
  overflow: scroll;
  height: calc(100% - 60px);
  border: 1px solid #39424c;
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
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
const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  font-style: italic;
  color: #fff;
  margin: 18px 0;
  padding-left: 12px;
  border-left: 2px solid #fff;
`;
const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ItemWraper = styled.div`
  border-bottom: 1px solid #39424c;
`;
const CommentButton = styled(ButtonPrimaryLine)`
  position: sticky;
  bottom: 20px;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10%;
  font-weight: 600;
  color: #fff;
`;
