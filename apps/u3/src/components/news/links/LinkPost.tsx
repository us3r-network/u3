import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import LensPostCard from 'src/components/social/lens/LensPostCard';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import Loading from 'src/components/common/loading/Loading';
import useFarcasterCurrFid from 'src/hooks/social/farcaster/useFarcasterCurrFid';
import { FeedsType } from 'src/components/social/SocialPageNav';

import AddPostForm from 'src/components/social/AddPostForm';
import useLogin from 'src/hooks/shared/useLogin';
import { useLensCtx } from 'src/contexts/social/AppLensCtx';
import { getOwnedByAddress } from 'src/utils/social/lens/profile';
import { SocialPlatform } from 'src/services/social/types';
import { useLoadLinkFeeds } from 'src/hooks/social/useLoadLinkFeeds';
import AddPost from 'src/components/social/AddPost';

export default function LinkPost({ url }: { url: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [parentId, setParentId] = useState('social-all');
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const fid = useFarcasterCurrFid();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const lensProfileOwnedByAddress = getOwnedByAddress(lensSessionProfile);

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

  return (
    <Wraper id="link-social-scroll-wrapper">
      <Title>Comments</Title>
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
          scrollThreshold="1000px"
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
                    <ItemWraper>
                      <FCast
                        key={data.id}
                        cast={data}
                        openFarcasterQR={openFarcasterQR}
                        farcasterUserData={farcasterUserData}
                        showMenuBtn
                      />
                    </ItemWraper>
                  );
                case SocialPlatform.Lens:
                  return (
                    <ItemWraper>
                      <LensPostCard key={data.id} data={data} />
                    </ItemWraper>
                  );
                default:
                  return null;
              }
            })}
          </PostList>
        </InfiniteScroll>
      )}
      <AddPostButtonWrapper>
        <AddPost />
      </AddPostButtonWrapper>
    </Wraper>
  );
}

const Wraper = styled.div`
  width: 360px;
  background: #212228;
  overflow: scroll;
  position: relative;
  flex-shrink: 0;
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
const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  font-style: italic;
  color: #fff;
  margin: 20px;
`;
const PostList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ItemWraper = styled.div`
  border-top: 1px solid #39424c;
`;
const AddPostButtonWrapper = styled.div`
  position: sticky;
  bottom: 20px;
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 15%;
`;
