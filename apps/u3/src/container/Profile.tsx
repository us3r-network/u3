import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useActiveProfile } from '@lens-protocol/react-web';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import ProfilePageNav, {
  FeedsType,
} from '../components/profile/ProfilePageNav';
import { useLoadProfileFeeds } from '../hooks/useLoadProfileFeeds';
import useFarcasterCurrFid from '../hooks/farcaster/useFarcasterCurrFid';
import UserInfoStyled from '../components/s3/profile/UserInfoStyled';
import UserWalletsStyled from '../components/s3/profile/UserWalletsStyled';
import UserTagsStyled from '../components/s3/profile/UserTagsStyled';
import Loading from '../components/common/loading/Loading';
import LensPostCard from '../components/social/lens/LensPostCard';
import FCast from '../components/social/farcaster/FCast';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import ModalImg from '../components/social/ModalImg';
import { ProfileFeedsGroups } from '../api/feeds';
import { LensComment, LensMirror, LensPost } from '../api/lens';
import Rss3Content from '../components/fren/Rss3Content';
import { NoActivity } from './Activity';

function ProfileInfo() {
  return (
    <ProfileInfoWrap>
      <UserInfoStyled />
      <UserWalletsStyled />
      <UserTagsStyled />
    </ProfileInfoWrap>
  );
}
const ProfileInfoWrap = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
    width: 100%;
  }
`;

export default function Profile() {
  const { wallet } = useParams();
  const [feedsType, setFeedsType] = useState(FeedsType.POSTS);
  const [modalImg, setModalImg] = useState('');

  const { openFarcasterQR, farcasterUserData } = useFarcasterCtx();
  const { data: activeLensProfile, loading: activeLensProfileLoading } =
    useActiveProfile();

  const fid = useFarcasterCurrFid();
  const {
    firstLoading,
    moreLoading,
    feeds,
    pageInfo,
    loadFirstFeeds,
    loadMoreFeeds,
  } = useLoadProfileFeeds();

  const loadFirstSocialFeeds = useCallback(() => {
    if (feedsType === FeedsType.ACTIVITIES) return;
    loadFirstFeeds({
      activeLensProfileId: activeLensProfile?.id,
      lensProfileId: activeLensProfile?.id,
      fid,
      group: feedsType as unknown as ProfileFeedsGroups,
    });
  }, [loadFirstFeeds, activeLensProfile?.id, fid, feedsType, wallet]);

  const loadMoreSocialFeeds = useCallback(() => {
    if (feedsType === FeedsType.ACTIVITIES) return;
    loadMoreFeeds({
      activeLensProfileId: activeLensProfile?.id,
      lensProfileId: activeLensProfile?.id,
      fid,
      group: feedsType as unknown as ProfileFeedsGroups,
    });
  }, [loadMoreFeeds, activeLensProfile?.id, fid, feedsType, wallet]);

  useEffect(() => {
    if (activeLensProfileLoading) return;
    loadFirstSocialFeeds();
  }, [activeLensProfileLoading, loadFirstSocialFeeds]);

  return (
    <ProfileWrapper id="profile-wrapper">
      <ProfilePageNav
        feedsType={feedsType}
        onChangeFeedsType={(type) => {
          setFeedsType(type);
        }}
      />
      <MainWrapper>
        {!isMobile && (
          <MainLeft>
            <ProfileInfo />
          </MainLeft>
        )}

        <MainCenter>
          {(() => {
            if (feedsType === FeedsType.ACTIVITIES) {
              return (
                <Rss3Content
                  empty={
                    <NoActivityWrapper>
                      <NoActivity />
                    </NoActivityWrapper>
                  }
                />
              );
            }

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
                  console.log('next');
                  console.log({ moreLoading, firstLoading, pageInfo });

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
                      switch (feedsType) {
                        case FeedsType.POSTS:
                          d = data as LensPost;
                          break;
                        case FeedsType.REPOSTS:
                          d = (data as LensMirror).mirrorOf;
                          break;
                        case FeedsType.REPLIES:
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
                          openImgModal={(url) => {
                            setModalImg(url);
                          }}
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
        {!isMobile && <MainRight />}
      </MainWrapper>
      <ModalImg url={modalImg} onAfterClose={() => setModalImg('')} />
    </ProfileWrapper>
  );
}
const ProfileWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
  padding: 24px;
  margin-bottom: 20px;
  ${isMobile &&
  `
  height: 100vh;
  padding: 10px;
  padding-bottom: 60px;
  `}
`;
const MainWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 40px;
`;
const MainLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: fit-content;
`;
const MainCenter = styled.div`
  width: 600px;
`;
const MainRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: fit-content;
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
  /* & > *:not(:first-child) { */
  /* border-top: 1px solid #718096; */
  /* } */
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
