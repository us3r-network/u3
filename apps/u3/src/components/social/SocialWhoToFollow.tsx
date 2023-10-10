import {
  Profile,
  useActiveProfile,
  useFollow,
  useProfilesToFollow,
} from '@lens-protocol/react-web';
import styled from 'styled-components';
import useFarcasterCurrFid from 'src/hooks/farcaster/useFarcasterCurrFid';
import useFarcasterFollowAction from 'src/hooks/farcaster/useFarcasterFollowAction';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getAvatar from '../../utils/lens/getAvatar';
import { SocialButtonPrimaryLine } from './button/SocialButton';
import { useLensCtx } from '../../contexts/AppLensCtx';
import LensIcon from '../icons/LensIcon';
import FarcasterIcon from '../icons/FarcasterIcon';
import useFarcasterRecommendedProfile from '../../hooks/farcaster/useFarcasterRecommendedProfile';
import useFarcasterUserData from '../../hooks/farcaster/useFarcasterUserData';
import useLogin from '../../hooks/useLogin';

const SUGGEST_NUM = 3;
export default function SocialWhoToFollow() {
  const navigate = useNavigate();
  const { isLogin: isLoginU3 } = useLogin();
  const { isLogin: isLoginLens } = useLensCtx();
  const { data: lensProfiles } = useProfilesToFollow();
  const lensRecommendedProfiles: Profile[] = useMemo(
    () =>
      lensProfiles
        ?.filter((profile) => profile.name && profile.name !== '')
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
  const [isFollowing, setIsFollowing] = useState(false);
  const { data: lensActiveProfile } = useActiveProfile();
  const { execute: follow, isPending } = useFollow({
    followee: profile,
    follower: lensActiveProfile,
  });
  const { name, handle } = profile;
  return (
    <FollowItemWrapper>
      <Avatar src={getAvatar(profile)} />
      <NameHandleWraper>
        <NameText>{name}</NameText>
        <HandleText>@{handle}</HandleText>
      </NameHandleWraper>
      {!isFollowing ? (
        <FollowBtn
          onClick={() => {
            follow().then(() => {
              setIsFollowing(true);
            });
          }}
          disabled={isPending}
        >
          <LensIcon />
          {isPending ? 'Following...' : 'Follow'}
        </FollowBtn>
      ) : (
        <FollowedText>Followed</FollowedText>
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
  const userData = useFarcasterUserData({
    farcasterUserData,
    fid: String(fid),
  });
  const {
    followAction: follow,
    isPending,
    isFollowing,
  } = useFarcasterFollowAction();
  return (
    <FollowItemWrapper>
      <Avatar src={userData.pfp} />
      <NameHandleWraper>
        <NameText>{userData.display}</NameText>
        <HandleText>@{userData.userName}</HandleText>
      </NameHandleWraper>
      {!isFollowing ? (
        <FollowBtn onClick={() => follow(fid)} disabled={isPending}>
          <FarcasterIcon />
          {isPending ? 'Following...' : 'Follow'}
        </FollowBtn>
      ) : (
        <FollowedText>Followed</FollowedText>
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
  /* gap: 20px; */
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
  margin-top: 6px;
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
`;
const HandleText = styled.div`
  font-size: 12px;
  color: grey;
  font-style: normal;
  font-weight: 500;
  line-height: 0;
`;
const FollowBtn = styled(SocialButtonPrimaryLine)`
  width: 80px;
  height: 40px;
  gap: 4px;
`;
const FollowedText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: grey;
`;
