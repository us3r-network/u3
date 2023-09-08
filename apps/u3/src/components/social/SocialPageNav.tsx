import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import MobilePageHeader from '../common/mobile/MobilePageHeader';

export enum FeedsType {
  FOLLOWING = 'following',
  TRENDING = 'trending',
}
export default function SocialPageNav({
  showFeedsTabs,
  feedsType,
  onChangeFeedsType,
}: {
  showFeedsTabs: boolean;
  feedsType: FeedsType;
  onChangeFeedsType: (feedsType: FeedsType) => void;
}) {
  return (
    <SocialNavWrapper>
      {!isMobile && (
        <SocialNavLeft>
          <SocialNavTitle>Social</SocialNavTitle>
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
  return (
    <FeedsTypeTabsWrapper>
      <FeedsTypeTab
        active={feedsType === FeedsType.FOLLOWING}
        onClick={() => {
          onChangeFeedsType(FeedsType.FOLLOWING);
        }}
      >
        Following
      </FeedsTypeTab>
      <FeedsTypeTab
        active={feedsType === FeedsType.TRENDING}
        onClick={() => {
          onChangeFeedsType(FeedsType.TRENDING);
        }}
      >
        Trending
      </FeedsTypeTab>
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
  const tabs = [FeedsType.FOLLOWING, FeedsType.TRENDING];
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
