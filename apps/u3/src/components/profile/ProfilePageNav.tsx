import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import MobilePageHeader from '../layout/mobile/MobilePageHeader';

export enum FeedsType {
  POSTS = 'posts',
  REPOSTS = 'reposts',
  REPLIES = 'replies',
  LIKES = 'likes',
}
export default function ProfilePageNav({
  showFeedsTabs = true,
  enabledFeedsTypes,
  feedsType,
  onChangeFeedsType,
}: {
  showFeedsTabs?: boolean;
  enabledFeedsTypes?: FeedsType[];
  feedsType: FeedsType;
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  return (
    <SocialNavWrapper>
      <SocialNavCenter>
        {showFeedsTabs &&
          (isMobile ? (
            <MobileFeedsTypeTable
              enabledFeedsTypes={enabledFeedsTypes}
              feedsType={feedsType}
              onChangeFeedsType={onChangeFeedsType}
            />
          ) : (
            <PcFeedsTypeTable
              enabledFeedsTypes={enabledFeedsTypes}
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
  enabledFeedsTypes,
  onChangeFeedsType,
}: {
  feedsType: FeedsType;
  enabledFeedsTypes?: FeedsType[];
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  const tabs = [
    {
      name: 'Posts',
      value: FeedsType.POSTS,
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
  const showTabs = enabledFeedsTypes
    ? tabs.filter((tab) => enabledFeedsTypes.includes(tab.value))
    : tabs;
  return (
    <FeedsTypeTabsWrapper>
      {showTabs.map((tab) => (
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
  enabledFeedsTypes,
  onChangeFeedsType,
}: {
  feedsType: FeedsType;
  enabledFeedsTypes?: FeedsType[];
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  const tabs = [
    FeedsType.POSTS,
    FeedsType.REPOSTS,
    FeedsType.REPLIES,
    // FeedsType.LIKES,
  ];
  const showTabs = enabledFeedsTypes
    ? tabs.filter((tab) => enabledFeedsTypes.includes(tab))
    : tabs;
  return (
    <MobilePageHeader
      tabs={showTabs}
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
const SocialNavCenter = styled.div`
  width: 600px;
  height: 100%;
`;
const SocialNavRight = styled.div`
  flex: 1;
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
