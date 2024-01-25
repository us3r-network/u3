import { ComponentPropsWithRef, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

import MobilePageHeader from '../layout/mobile/MobilePageHeader';
import { ArrowLeft } from '../common/icons/ArrowLeft';
import PinChannelBtn from './PinChannelBtn';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { cn } from '@/lib/utils';

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
  const { getChannelFromId } = useFarcasterCtx();
  const navigate = useNavigate();
  const channel = useMemo(() => {
    return isChannel ? getChannelFromId(channelId) : null;
  }, [channelId, getChannelFromId]);

  return (
    <SocialNavWrapper>
      {!isMobile && (
        <SocialNavLeft>
          <SocialNavTitle>Social</SocialNavTitle>
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
                <img src={channel?.image} alt="" />
              </>
            )}
            <span>{isChannel && channel ? channel.name : title}</span>
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
function MobileFeedsTypeTableItem({
  isActive,
  className,
  ...props
}: ComponentPropsWithRef<'span'> & {
  isActive?: boolean;
}) {
  return (
    <span
      className={cn(
        'text-[#718096] text-[16px] font-normal',
        className || '',
        isActive ? 'text-white font-medium' : ''
      )}
      {...props}
    />
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
    <div className="w-full h-[40px] py-[10px] flex justify-center items-center gap-[15px] flex-[1_0_0]">
      <MobileFeedsTypeTableItem
        isActive={type === ''}
        onClick={() => {
          onChangeFeedsType(FeedsType.TRENDING);
          navigate(`/social/${currentPlatform}`);
        }}
      >
        Trending
      </MobileFeedsTypeTableItem>
      <div className="w-[1px] h-[10px] bg-slate-500" />
      <MobileFeedsTypeTableItem
        isActive={type === 'following'}
        onClick={() => {
          onChangeFeedsType(FeedsType.FOLLOWING);
          navigate(`/social/${currentPlatform}/following`);
        }}
      >
        Following
      </MobileFeedsTypeTableItem>
      <div className="w-[1px] h-[10px] bg-slate-500" />
      <MobileFeedsTypeTableItem
        isActive={type === 'whatsnew'}
        onClick={() => {
          onChangeFeedsType(FeedsType.WHATSNEW);
          navigate(`/social/${currentPlatform}/whatsnew`);
        }}
      >
        Newest
      </MobileFeedsTypeTableItem>
    </div>
  );
}

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
