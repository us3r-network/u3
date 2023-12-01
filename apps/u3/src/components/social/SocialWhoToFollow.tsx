import {
  Profile,
  useFollow,
  useRecommendedProfiles,
  useUnfollow,
} from '@lens-protocol/react-web';
import styled from 'styled-components';
import useFarcasterCurrFid from 'src/hooks/social/farcaster/useFarcasterCurrFid';
import useFarcasterFollowAction from 'src/hooks/social/farcaster/useFarcasterFollowAction';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getAvatar from '../../utils/social/lens/getAvatar';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import LensIcon from '../common/icons/LensIcon';
import FarcasterIcon from '../common/icons/FarcasterIcon';
import useFarcasterRecommendedProfile from '../../hooks/social/farcaster/useFarcasterRecommendedProfile';
import useFarcasterUserData from '../../hooks/social/farcaster/useFarcasterUserData';
import useLogin from '../../hooks/shared/useLogin';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import TooltipProfileNavigateLink from '../profile/profile-info/TooltipProfileNavigateLink';
import { getHandle, getName } from '../../utils/social/lens/profile';

const SUGGEST_NUM = 3;
export default function SocialWhoToFollow() {
  const navigate = useNavigate();
  const { isLogin: isLoginU3 } = useLogin();
  const { isLogin: isLoginLens, sessionProfile: lensProfile } = useLensCtx();
  // const { data: lensProfiles } = lensProfile?.id
  //   ? useRecommendedProfiles({
  //       for: lensProfile?.id,
  //     })
  //   : { data: undefined };
  const { data: lensProfiles } = useRecommendedProfiles({
    for: lensProfile?.id,
  });
  const lensRecommendedProfiles: Profile[] = useMemo(
    () =>
      lensProfiles
        ?.filter((profile) => getName(profile) && getName(profile) !== '')
        .slice(0, SUGGEST_NUM),
    [lensProfiles, isLoginLens]
  );
  const fid = Number(useFarcasterCurrFid());
  const { farcasterRecommendedProfileData } = useFarcasterRecommendedProfile({
    fid,
    num: SUGGEST_NUM,
  });
  return (
    isLoginU3 &&
    (fid || isLoginLens) && (
      <Wrapper>
        <Header>
          <Title>Who to follow?</Title>
          <MoreButton
            onClick={() => {
              navigate(`/social/suggest-follow`);
            }}
          >
            View All
          </MoreButton>
        </Header>
        <FollowListWrapper>
          {fid > 0 &&
            farcasterRecommendedProfileData?.recommendedFids?.length > 0 &&
            farcasterRecommendedProfileData.recommendedFids.map(
              (recommendedFid) => (
                <FarcasterFollowItem
                  key={recommendedFid}
                  fid={recommendedFid}
                  farcasterUserData={
                    farcasterRecommendedProfileData.farcasterUserData
                  }
                />
              )
            )}
          {isLoginLens &&
            lensRecommendedProfiles &&
            lensRecommendedProfiles.map((profile) => (
              <LensFollowItem key={profile.id} profile={profile} />
            ))}
        </FollowListWrapper>
      </Wrapper>
    )
  );
}

type LensFollowItemProps = {
  profile: Profile;
};

function LensFollowItem({ profile }: LensFollowItemProps) {
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const { execute: follow, loading: followLoading } = useFollow();
  const { execute: unfollow, loading: unfollowLoading } = useUnfollow();

  const name = getName(profile);
  const handle = getHandle(profile);
  const profileIdentity = useMemo(() => {
    if (handle.endsWith('.eth')) return handle;
    return lensHandleToBioLinkHandle(handle);
  }, [handle]);

  const profileUrl = useMemo(() => `/u/${profileIdentity}`, [profileIdentity]);

  return (
    <FollowItemWrapper>
      <TooltipProfileNavigateLink identity={profileIdentity}>
        <Avatar src={getAvatar(profile)} />
      </TooltipProfileNavigateLink>

      <NameHandleWraper>
        <NameText>
          <a
            href={profileUrl}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(profileUrl);
            }}
          >
            {name}
          </a>
          <LensIcon />
        </NameText>
        <HandleText>@{handle}</HandleText>
      </NameHandleWraper>
      {!isFollowing ? (
        <FollowBtn
          onClick={() => {
            follow({ profile }).then(() => {
              setIsFollowing(true);
            });
          }}
          disabled={followLoading}
        >
          {followLoading ? 'Following...' : 'Follow'}
        </FollowBtn>
      ) : (
        // <FollowedText>Followed</FollowedText>
        <FollowBtn
          onClick={() => {
            unfollow({ profile }).then(() => {
              setIsFollowing(false);
            });
          }}
          disabled={unfollowLoading}
        >
          {unfollowLoading ? 'Unfollowing...' : 'Unfollow'}
        </FollowBtn>
      )}
    </FollowItemWrapper>
  );
}

type FarcasterFollowItemProps = {
  fid: number;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
};

function FarcasterFollowItem({
  fid,
  farcasterUserData,
}: FarcasterFollowItemProps) {
  const navigate = useNavigate();

  const userData = useFarcasterUserData({
    farcasterUserData,
    fid: String(fid),
  });
  const {
    followAction: follow,
    unfollowAction: unfollow,
    isPending,
    isFollowing,
  } = useFarcasterFollowAction();

  const profileIdentity = useMemo(() => {
    if (userData.userName.endsWith('.eth')) return userData.userName;
    return farcasterHandleToBioLinkHandle(userData.userName);
  }, [userData]);

  const profileUrl = useMemo(() => `/u/${profileIdentity}`, [profileIdentity]);

  return (
    <FollowItemWrapper>
      <TooltipProfileNavigateLink identity={profileIdentity}>
        <Avatar src={userData.pfp} />
      </TooltipProfileNavigateLink>

      <NameHandleWraper>
        <NameText>
          <a
            href={profileUrl}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              navigate(profileUrl);
            }}
          >
            {userData.display}
          </a>

          <FarcasterIcon />
        </NameText>
        <HandleText>@{userData.userName}</HandleText>
      </NameHandleWraper>
      {!isFollowing ? (
        <FollowBtn onClick={() => follow(fid)} disabled={isPending}>
          {isPending ? 'Following...' : 'Follow'}
        </FollowBtn>
      ) : (
        // <FollowedText>Followed</FollowedText>
        <FollowBtn onClick={() => unfollow(fid)} disabled={isPending}>
          {isPending ? 'Unfollowing...' : 'Unfollow'}
        </FollowBtn>
      )}
    </FollowItemWrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
const Title = styled.h1`
  color: #718096;
  font-family: Rubik;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
`;
const MoreButton = styled.button`
  cursor: pointer;
  color: #718096;
  font-size: 16px;
  font-weight: 500;
  border: none;
  outline: none;
  background: inherit;
`;
const FollowListWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid #718096;
  border-radius: 20px;
  background-color: #212228;
  > :not(:first-child) {
    border-top: 1px solid #718096;
  }
`;
const FollowItemWrapper = styled.div`
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;
const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;
const NameHandleWraper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const NameText = styled.div`
  font-size: 16px;
  color: white;
  font-style: normal;
  font-weight: 700;
  line-height: 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  & > a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const HandleText = styled.div`
  font-size: 12px;
  color: grey;
  font-style: normal;
  font-weight: 500;
  line-height: 0;
`;
const FollowBtn = styled.button`
  width: 80px;
  height: 40px;
  gap: 4px;
  background-color: #14171a;
  color: white;
  border: none;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 700;
`;
const FollowedText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: grey;
`;
