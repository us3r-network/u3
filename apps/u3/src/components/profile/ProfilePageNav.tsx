import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import MobilePageHeader from '../common/mobile/MobilePageHeader';

export enum FeedsType {
  POSTS = 'posts',
  REPOSTS = 'reposts',
  REPLIES = 'replies',
  LIKES = 'likes',
  ACTIVITIES = 'activities',
}
export default function ProfilePageNav({
  showFeedsTabs = true,
  feedsType,
  onChangeFeedsType,
}: {
  showFeedsTabs?: boolean;
  feedsType: FeedsType;
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  return (
    <SocialNavWrapper>
      {!isMobile && (
        <SocialNavLeft>
          <SocialNavTitle>Profile</SocialNavTitle>
          <SocialNavDividingLine />
        </SocialNavLeft>
      )}

      <SocialNavCenter>
        {showFeedsTabs &&
          (isMobile ? (
            <MobileFeedsTypeTable
              feedsType={feedsType}
              onChangeFeedsType={onChangeFeedsType}
            />
          ) : (
            <PcFeedsTypeTable
              feedsType={feedsType}
              onChangeFeedsType={onChangeFeedsType}
            />
          ))}
      </SocialNavCenter>
      {!isMobile && <SocialNavRight />}
    </SocialNavWrapper>
  );
}
function PcFeedsTypeTable({
  feedsType,
  onChangeFeedsType,
}: {
  feedsType: FeedsType;
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  const tabs = [
    {
      name: 'Posts',
      value: FeedsType.POSTS,
    },
    {
      name: 'Activities',
      value: FeedsType.ACTIVITIES,
    },
    {
      name: 'Reposts',
      value: FeedsType.REPOSTS,
    },
    {
      name: 'Replies',
      value: FeedsType.REPLIES,
    },
    // {
    //   name: 'Likes',
    //   value: FeedsType.LIKES,
    // },
  ];
  return (
    <FeedsTypeTabsWrapper>
      {tabs.map((tab) => (
        <FeedsTypeTab
          key={tab.value}
          active={feedsType === tab.value}
          onClick={() => onChangeFeedsType(tab.value)}
        >
          {tab.name}
        </FeedsTypeTab>
      ))}
    </FeedsTypeTabsWrapper>
  );
}
function MobileFeedsTypeTable({
  feedsType,
  onChangeFeedsType,
}: {
  feedsType: FeedsType;
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  const tabs = [
    FeedsType.POSTS,
    FeedsType.ACTIVITIES,
    FeedsType.REPOSTS,
    FeedsType.REPLIES,
    // FeedsType.LIKES,
  ];
  return (
    <MobilePageHeader
      tabs={tabs}
      setTab={onChangeFeedsType}
      curTab={feedsType}
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
const SocialNavTitle = styled.div`
  color: #fff;
  font-family: Rubik;
  font-size: 24px;
  font-style: italic;
  font-weight: 700;
  line-height: normal;
`;
const SocialNavDividingLine = styled.div`
  width: 20px;
  height: 1px;
  transform: rotate(120deg);
  background: #39424c;
`;

const FeedsTypeTabsWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  gap: 40px;
`;
const FeedsTypeTab = styled.div<{ active: boolean }>`
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
