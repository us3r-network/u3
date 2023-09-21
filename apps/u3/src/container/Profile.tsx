import { useCallback, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useActiveProfile } from '@lens-protocol/react-web';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import KeepAlive from 'react-activation';
import ProfilePageNav, {
  FeedsType,
} from '../components/profile/ProfilePageNav';
import { useLoadProfileFeeds } from '../hooks/useLoadProfileFeeds';
import useFarcasterCurrFid from '../hooks/farcaster/useFarcasterCurrFid';
import UserWalletsStyled from '../components/s3/profile/UserWalletsStyled';
import UserTagsStyled from '../components/s3/profile/UserTagsStyled';
import Loading from '../components/common/loading/Loading';
import LensPostCard from '../components/social/lens/LensPostCard';
import FCast from '../components/social/farcaster/FCast';
import { useFarcasterCtx } from '../contexts/FarcasterCtx';
import { ProfileFeedsGroups } from '../api/feeds';
import { LensComment, LensMirror, LensPost } from '../api/lens';
import Rss3Content from '../components/fren/Rss3Content';
import { NoActivity } from './Activity';
import { LogoutButton } from '../components/layout/LoginButton';
import useLogin from '../hooks/useLogin';
import LogoutConfirmModal from '../components/layout/LogoutConfirmModal';
import ProfileInfoCard from '../components/profile/profile-info/ProfileInfoCard';
import { RouteKey } from '../route/routes';
import {
  selectWebsite,
  setProfilePageFeedsType,
} from '../features/website/websiteSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function ProfileInfo(props: StyledComponentPropsWithRef<'div'>) {
  const { address } = useAccount();
  return (
    <ProfileInfoWrap {...props}>
      <ProfileInfoCard address={address} />
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
  const { logout } = useLogin();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const { wallet } = useParams();
  const { profilePageFeedsType } = useAppSelector(selectWebsite);
  const dispatch = useAppDispatch();
  return (
    <ProfileWrapper id="profile-wrapper">
      {isMobile && (
        <ProfileInfoMobileWrapper>
          <ProfileInfoMobile />
          <LogoutButton
            className="logout-button"
            onClick={() => {
              setOpenLogoutConfirm(true);
            }}
          />
        </ProfileInfoMobileWrapper>
      )}
      <ProfilePageNav
        feedsType={profilePageFeedsType}
        onChangeFeedsType={(type) => {
          dispatch(setProfilePageFeedsType(type));
        }}
      />

      <MainWrapper>
        {!isMobile && (
          <MainLeft>
            <ProfileInfo />
            <LogoutButton
              className="logout-button"
              onClick={() => {
                setOpenLogoutConfirm(true);
              }}
            />
          </MainLeft>
        )}

        <KeepAlive
          cacheKey={`${RouteKey.profile}_social_${wallet}_${profilePageFeedsType}`}
          saveScrollPosition="#profile-wrapper"
        >
          <ProfileSocial wallet={wallet} feedsType={profilePageFeedsType} />
        </KeepAlive>

        {!isMobile && <MainRight />}
      </MainWrapper>
      <LogoutConfirmModal
        isOpen={openLogoutConfirm}
        onClose={() => {
          setOpenLogoutConfirm(false);
        }}
        onConfirm={() => {
          logout();
          setOpenLogoutConfirm(false);
        }}
      />
    </ProfileWrapper>
  );
}

function ProfileSocial({
  wallet,
  feedsType,
}: {
  wallet: string;
  feedsType: FeedsType;
}) {
  const {
    openFarcasterQR,
    farcasterUserData,
    isConnected: isConnectedFarcaster,
  } = useFarcasterCtx();
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
      fid: isConnectedFarcaster ? fid : undefined,
      group: feedsType as unknown as ProfileFeedsGroups,
    });
  }, [
    loadFirstFeeds,
    activeLensProfile?.id,
    fid,
    feedsType,
    wallet,
    isConnectedFarcaster,
  ]);

  const loadMoreSocialFeeds = useCallback(() => {
    if (feedsType === FeedsType.ACTIVITIES) return;
    loadMoreFeeds({
      activeLensProfileId: activeLensProfile?.id,
      lensProfileId: activeLensProfile?.id,
      fid: isConnectedFarcaster ? fid : undefined,
      group: feedsType as unknown as ProfileFeedsGroups,
    });
  }, [
    loadMoreFeeds,
    activeLensProfile?.id,
    fid,
    feedsType,
    wallet,
    isConnectedFarcaster,
  ]);

  useEffect(() => {
    if (activeLensProfileLoading) return;
    loadFirstSocialFeeds();
  }, [activeLensProfileLoading, loadFirstSocialFeeds]);
  return (
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
const ProfileInfoMobileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;
const ProfileInfoMobile = styled(ProfileInfo)`
  width: 100%;
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
  max-height: calc(100vh - 40px);
  overflow-y: auto;
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
