import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import MobilePageHeader from '../common/mobile/MobilePageHeader';
import { ArrowLeft } from '../icons/ArrowLeft';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';
import { SocailPlatform } from '../../api';

export enum FollowType {
  FOLLOWING = 'following',
  FOLLOWERS = 'followers',
}
export default function ProfilePageFollowNav({
  followType,
  activePlatform,
  platformCount,
  onChangePlatform,
  goBack,
}: {
  followType: FollowType;
  activePlatform: SocailPlatform;
  platformCount: {
    [platform in SocailPlatform]: number;
  };
  onChangePlatform: (platform: SocailPlatform) => void;
  goBack: () => void;
}) {
  return (
    <SocialNavWrapper>
      {!isMobile && (
        <SocialNavLeft>
          <GoBackBtn
            onClick={() => {
              goBack();
            }}
          >
            <ArrowLeft />
          </GoBackBtn>
        </SocialNavLeft>
      )}

      <SocialNavCenter>
        {isMobile ? (
          <MobileFollowPlatformTable
            followType={followType}
            activePlatform={activePlatform}
            platformCount={platformCount}
            onChangePlatform={onChangePlatform}
          />
        ) : (
          <PcFollowPlatformTable
            followType={followType}
            activePlatform={activePlatform}
            platformCount={platformCount}
            onChangePlatform={onChangePlatform}
          />
        )}
      </SocialNavCenter>
      {!isMobile && <SocialNavRight />}
    </SocialNavWrapper>
  );
}
function PcFollowPlatformTable({
  followType,
  activePlatform,
  platformCount,
  onChangePlatform,
}: {
  followType: FollowType;
  activePlatform: SocailPlatform;
  platformCount: {
    [platform in SocailPlatform]: number;
  };
  onChangePlatform: (platform: SocailPlatform) => void;
}) {
  const followTypeText =
    followType.slice(0, 1).toUpperCase() + followType.slice(1);
  const tabs = [
    {
      name: `Farcaster ${followTypeText}(${
        platformCount[SocailPlatform.Farcaster] || 0
      })`,
      value: SocailPlatform.Farcaster,
    },
    {
      name: `Lens ${followTypeText}(${
        platformCount[SocailPlatform.Lens] || 0
      })`,
      value: SocailPlatform.Lens,
    },
  ];
  return (
    <FollowTypeTabsWrapper>
      {tabs.map((tab) => (
        <FollowTypeTab
          key={tab.value}
          active={activePlatform === tab.value}
          onClick={() => onChangePlatform(tab.value)}
        >
          {tab.name}
        </FollowTypeTab>
      ))}
    </FollowTypeTabsWrapper>
  );
}
function MobileFollowPlatformTable({
  followType,
  activePlatform,
  platformCount,
  onChangePlatform,
}: {
  followType: FollowType;
  activePlatform: SocailPlatform;
  platformCount: {
    [platform in SocailPlatform]: number;
  };
  onChangePlatform: (platform: SocailPlatform) => void;
}) {
  const followTypeText =
    followType.slice(0, 1).toUpperCase() + followType.slice(1);
  const options = [
    {
      label: `Farcaster ${followTypeText}(${
        platformCount[SocailPlatform.Farcaster] || 0
      })`,
      value: SocailPlatform.Farcaster,
    },
    {
      label: `Lens ${followTypeText}(${
        platformCount[SocailPlatform.Lens] || 0
      })`,
      value: SocailPlatform.Lens,
    },
  ];
  return (
    <MobilePageHeader
      options={options}
      setTab={onChangePlatform}
      curTab={activePlatform}
    />
  );
}
const SocialNavWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  ${!isMobile &&
  `  height: 72px;
  gap: 40px;
  align-self: stretch;
  border-bottom: 1px solid #39424c;
  `}
`;
const SocialNavLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 112px;
`;
const SocialNavCenter = styled.div`
  width: 600px;
  height: 100%;
`;
const SocialNavRight = styled.div`
  flex: 1;
`;

const GoBackBtn = styled(ButtonPrimaryLine)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0px;
`;

const FollowTypeTabsWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 40px;
`;
const FollowTypeTab = styled.div<{ active: boolean }>`
  height: 100%;
  color: ${({ active }) => (active ? '#FFF' : '#718096')};
  /* Bold-18 */
  font-family: Rubik;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 72px;
  cursor: pointer;
  border-bottom: ${({ active }) => (active ? '2px solid #fff' : 'none')};
  box-sizing: border-box;
`;
