import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

import MobilePageHeader from '../layout/mobile/MobilePageHeader';
import { ArrowLeft } from '../common/icons/ArrowLeft';
import { getChannelFromId } from '../../utils/social/farcaster/getChannel';
import PinChannelBtn from './PinChannelBtn';

export enum FeedsType {
  FOLLOWING = 'following',
  TRENDING = 'trending',
  WHATSNEW = 'whatsnew',
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

export function SocialBackNav({
  title = 'Post',
  channelId,
  isChannel,
}: {
  title?: string;
  isChannel?: boolean;
  channelId?: string;
}) {
  const navigate = useNavigate();
  const channel = isChannel ? getChannelFromId(channelId) : null;
  return (
    <SocialNavWrapper>
      {!isMobile && (
        <SocialNavLeft>
          <SocialNavTitle>Social</SocialNavTitle>
          <SocialNavDividingLine />
        </SocialNavLeft>
      )}
      <SocialNavCenter>
        <div>
          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeft />
          </button>
          <div className="channels">
            {channel && (
              <>
                <span>#</span>
                <img src={channel.image} alt="" />
              </>
            )}
            <span>{isChannel ? channel.name : title}</span>
          </div>
        </div>
        {isChannel && channel && (
          <PinChannelBtn parent_url={channel.parent_url} />
        )}
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
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const currentPlatform = pathname.split('/')[2];
  const type = pathname.split('/')[3] || '';

  return (
    <FeedsTypeTabsWrapper>
      <FeedsTypeTab
        active={type === ''}
        onClick={() => {
          onChangeFeedsType(FeedsType.TRENDING);
          navigate(`/social/${currentPlatform}`);
        }}
      >
        Trending
      </FeedsTypeTab>
      <FeedsTypeTab
        active={type === 'following'}
        onClick={() => {
          onChangeFeedsType(FeedsType.FOLLOWING);
          navigate(`/social/${currentPlatform}/following`);
        }}
      >
        Following
      </FeedsTypeTab>
      <FeedsTypeTab
        active={type === 'whatsnew'}
        onClick={() => {
          onChangeFeedsType(FeedsType.WHATSNEW);
          navigate(`/social/${currentPlatform}/whatsnew`);
        }}
      >
        {`What's new?`}
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
  // const tabs = [FeedsType.FOLLOWING, FeedsType.TRENDING];
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const currentPlatform = pathname.split('/')[2];
  const type = pathname.split('/')[3] || '';

  return (
    <PageHeader>
      <div
        className={type === '' ? 'tab active' : 'tab'}
        onClick={() => {
          onChangeFeedsType(FeedsType.TRENDING);
          navigate(`/social/${currentPlatform}`);
        }}
      >
        trending
      </div>
      <div
        className={type === 'following' ? 'tab active' : 'tab'}
        onClick={() => {
          onChangeFeedsType(FeedsType.FOLLOWING);
          navigate(`/social/${currentPlatform}/following`);
        }}
      >
        following
      </div>
      <div
        className={type === 'whatsnew' ? 'tab active' : 'tab'}
        onClick={() => {
          onChangeFeedsType(FeedsType.WHATSNEW);
          navigate(`/social/${currentPlatform}/whatsnew`);
        }}
      >
        {`what's new?`}
      </div>
    </PageHeader>
  );
}

const PageHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px solid #39424c;
  border-radius: 100px;
  font-size: 16px;
  line-height: 28px;
  color: #ffffff;
  white-space: pre;

  i {
    color: #39424c;
  }

  .tab {
    cursor: pointer;
    flex: 1;
    text-align: center;
    color: #718096;
    padding: 5px 0;
  }

  .active {
    color: black;
    position: relative;
    background: #718096;
    box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
      0px 0px 4px rgba(20, 23, 26, 0.04);
    border-radius: 100px;
    /* &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 100%;
      height: 2px;
      background: white;
    } */
  }
`;

const SocialNavWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  ${!isMobile &&
  ` 
    height: 70px;
    gap: 40px;
    top: 0;
    position: sticky;
    z-index: 1;
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
  display: flex;
  align-items: center;
  gap: 40px;
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
    gap: 40px;
    > button {
      border-radius: 50%;
      display: flex;
      width: 40px;
      height: 40px;
      padding: 10px;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      flex-shrink: 0;
      border-radius: 100px;
      border: 1px solid #39424c;
      background: var(--neutral-100, #1a1e23);
      cursor: pointer;
    }

    > div.channels {
      display: flex;
      align-items: center;
      gap: 5px;
      > span {
        overflow: hidden;
        color: #fff;
        text-overflow: ellipsis;
        font-family: Rubik;
        font-size: 18px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }
  }
  img {
    width: 18px;
    height: 18px;
    object-fit: cover;
    border-radius: 2px;
  }
`;
const SocialNavRight = styled.div`
  flex-basis: 350px;
  flex-grow: 0;
  flex-shrink: 0;
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
