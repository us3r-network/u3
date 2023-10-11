import {
  Profile,
  useActiveProfile,
  useFollow,
  useProfilesToFollow,
} from '@lens-protocol/react-web';
import styled from 'styled-components';
import useFarcasterCurrFid from 'src/hooks/farcaster/useFarcasterCurrFid';
import useFarcasterFollowAction from 'src/hooks/farcaster/useFarcasterFollowAction';
import { useMemo, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import getAvatar from '../utils/lens/getAvatar';
import { SocialButtonPrimary } from '../components/social/button/SocialButton';
import { useLensCtx } from '../contexts/AppLensCtx';
import LensIcon from '../components/icons/LensIcon';
import FarcasterIcon from '../components/icons/FarcasterIcon';
import useFarcasterRecommendedProfile from '../hooks/farcaster/useFarcasterRecommendedProfile';
import useFarcasterUserData from '../hooks/farcaster/useFarcasterUserData';
import useLogin from '../hooks/useLogin';
import { SocailPlatform } from '../api';
import Loading from '../components/common/loading/Loading';

const SUGGEST_NUM = 20;
export default function SocialSuggestFollow() {
  const [loading, setLoading] = useState(false);

  const { socialPlatform } = useOutletContext<{
    socialPlatform: SocailPlatform | '';
  }>();
  const { isLogin: isLoginU3 } = useLogin();
  const { isLogin: isLoginLens } = useLensCtx();
  const { data: lensProfiles, loading: loadingLens } = useProfilesToFollow();
  const lensRecommendedProfiles: Profile[] = useMemo(
    () =>
      lensProfiles
        ?.filter((profile) => profile.name && profile.name !== '')
        .slice(0, SUGGEST_NUM),
    [lensProfiles, isLoginLens]
  );
  const fid = Number(useFarcasterCurrFid());
  const { farcasterRecommendedProfileData, loading: loadingFarcaster } =
    useFarcasterRecommendedProfile({
      fid,
      num: SUGGEST_NUM,
    });
  if (loading) {
    return (
      <LoadingWrapper>
        <Loading />
      </LoadingWrapper>
    );
  }

  useEffect(() => {
    setLoading(loadingLens && loadingFarcaster);
  }, [loadingLens, loadingFarcaster]);

  return (
    isLoginU3 &&
    (fid || isLoginLens) && (
      <Wrapper>
        <FollowListWrapper>
          {fid > 0 &&
            (socialPlatform === SocailPlatform.Farcaster ||
              socialPlatform === '') &&
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
            (socialPlatform === SocailPlatform.Lens || socialPlatform === '') &&
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
  const { name, handle, bio } = profile;
  return (
    <FollowItemWrapper>
      <Avatar src={getAvatar(profile)} />
      <NameBioWraper>
        <NameHandleWraper>
          <NameText>{name}</NameText>
          <HandleText>@{handle}</HandleText>
          <LensIcon />
        </NameHandleWraper>
        <BioText>{bio}</BioText>
      </NameBioWraper>
      {!isFollowing ? (
        <FollowBtn
          onClick={() => {
            follow().then(() => {
              setIsFollowing(true);
            });
          }}
          disabled={isPending}
        >
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
      <NameBioWraper>
        <NameHandleWraper>
          <NameText>{userData.display}</NameText>
          <HandleText>@{userData.userName}</HandleText>
          <FarcasterIcon />
        </NameHandleWraper>
        <BioText>{userData.bio}</BioText>
      </NameBioWraper>
      {!isFollowing ? (
        <FollowBtn onClick={() => follow(fid)} disabled={isPending}>
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
  object-fit: cover;
`;
const NameHandleWraper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;
const NameBioWraper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
const BioText = styled.div`
  font-size: 14px;
  font-style: normal;
  color: #718096;
  text-align: start;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
`;
const FollowBtn = styled(SocialButtonPrimary)`
  width: 80px;
  height: 40px;
  gap: 4px;
  font-size: 12px;
`;
const FollowedText = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: grey;
`;
const LoadingWrapper = styled.div`
  width: 600px;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
