import {
  Profile,
  ProfileId,
  useFollow,
  useRecommendedProfiles,
} from '@lens-protocol/react-web';
import styled from 'styled-components';
import useFarcasterCurrFid from 'src/hooks/social/farcaster/useFarcasterCurrFid';
import useFarcasterFollowAction from 'src/hooks/social/farcaster/useFarcasterFollowAction';
import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import getAvatar from '../../utils/social/lens/getAvatar';
import { SocialButtonPrimary } from '../../components/social/button/SocialButton';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import LensIcon from '../../components/common/icons/LensIcon';
import FarcasterIcon from '../../components/common/icons/FarcasterIcon';
import useFarcasterRecommendedProfile from '../../hooks/social/farcaster/useFarcasterRecommendedProfile';
import useFarcasterUserData from '../../hooks/social/farcaster/useFarcasterUserData';
import useLogin from '../../hooks/shared/useLogin';
import { SocialPlatform } from '../../services/social/types';
import {
  farcasterHandleToBioLinkHandle,
  lensHandleToBioLinkHandle,
} from '../../utils/profile/biolink';
import TooltipProfileNavigateLink from '../../components/profile/profile-info/TooltipProfileNavigateLink';
import { getBio, getHandle, getName } from '../../utils/social/lens/profile';

const SUGGEST_NUM = 20;
export default function SocialSuggestFollow() {
  const { socialPlatform } = useOutletContext<{
    socialPlatform: SocialPlatform | '';
  }>();
  const { isLogin: isLoginU3 } = useLogin();
  const { isLogin: isLoginLens, sessionProfile: lensProfile } = useLensCtx();
  const fid = Number(useFarcasterCurrFid());
  return (
    isLoginU3 && (
      <Wrapper>
        <FollowListWrapper>
          {fid > 0 &&
            (socialPlatform === SocialPlatform.Farcaster ||
              socialPlatform === '') && <FarcasterFollowList fid={fid} />}
          {isLoginLens &&
            (socialPlatform === SocialPlatform.Lens || socialPlatform === '') &&
            lensProfile &&
            lensProfile.id && <LensFollowList lensProfileId={lensProfile.id} />}
        </FollowListWrapper>
      </Wrapper>
    )
  );
}

function LensFollowList({
  lensProfileId,
  num = SUGGEST_NUM,
}: {
  lensProfileId: ProfileId;
  num?: number;
}) {
  const { data: lensProfiles } = useRecommendedProfiles({
    for: lensProfileId,
  });
  const lensRecommendedProfiles: Profile[] = useMemo(
    () => lensProfiles?.filter((profile) => !!getName(profile)).slice(0, num),
    [lensProfiles]
  );

  return (
    <ListWrapper>
      {lensRecommendedProfiles &&
        lensRecommendedProfiles.map((profile) => (
          <LensFollowItem key={profile.id} profile={profile} />
        ))}
    </ListWrapper>
  );
}

function FarcasterFollowList({
  fid,
  num = SUGGEST_NUM,
}: {
  fid: number;
  num?: number;
}) {
  const { farcasterRecommendedProfileData } = useFarcasterRecommendedProfile({
    fid,
    num,
  });
  return (
    <ListWrapper>
      {farcasterRecommendedProfileData?.recommendedFids?.length > 0 &&
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
    </ListWrapper>
  );
}

type LensFollowItemProps = {
  profile: Profile;
};

function LensFollowItem({ profile }: LensFollowItemProps) {
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const { execute: follow, loading: followLoading } = useFollow();

  const name = getName(profile);
  const handle = getHandle(profile);
  const bio = getBio(profile);
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

      <NameBioWraper>
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
          </NameText>
          <HandleText>@{handle}</HandleText>
          <LensIcon />
        </NameHandleWraper>
        <BioText>{bio}</BioText>
      </NameBioWraper>
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
  const navigate = useNavigate();

  const userData = useFarcasterUserData({
    farcasterUserData,
    fid: String(fid),
  });
  const {
    followAction: follow,
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
      <NameBioWraper>
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
          </NameText>
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
  /* border: 1px solid #718096; */
  border-radius: 20px;
  background-color: #212228;
  > :not(:first-child) {
    border-top: 1px solid #718096;
  }
`;
const ListWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > :not(:first-child) {
    border-top: 1px solid #39424c;
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
  max-width: 36px;
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
