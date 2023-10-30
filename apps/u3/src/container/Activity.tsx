import styled from 'styled-components';
import { useState } from 'react';

import { isMobile } from 'react-device-detect';
import CardBase from '../components/common/card/CardBase';
import PageTitle from '../components/layout/PageTitle';
import MobilePageHeader from '../components/layout/mobile/MobilePageHeader';
import Rss3Content from '../components/fren/Rss3Content';
import { CurrencyETH } from '../components/common/icons/currency-eth';
import { MainWrapper } from '../components/layout/Index';

const tabs = ['Feeds'];
function Activity() {
  const [tab, setTab] = useState<string>('Feeds');
  return (
    <Wrapper>
      {isMobile ? (
        <MobilePageHeader tabs={tabs} curTab={tab} setTab={setTab} />
      ) : (
        <PageHeader tab={tab}>
          <PageTitle>Activity</PageTitle>
          <i>{' / '}</i>

          {tabs?.map((key) => (
            <div
              key={key}
              className={tab === key ? 'tab active' : 'tab'}
              onClick={() => setTab(key)}
            >
              {key}
            </div>
          ))}
        </PageHeader>
      )}

      {tab === 'Feeds' && (
        <ContentWrapper>
          <Rss3Content empty={<NoActivity />} />
        </ContentWrapper>
      )}
    </Wrapper>
  );
}
export default Activity;
export function NoActivity() {
  return (
    <div className="no-item">
      <CurrencyETH />
      <p>No transactions found on Ethereum.</p>
    </div>
  );
}
const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentWrapper = styled(CardBase)`
  flex: 1;
  & .no-item {
    box-sizing: border-box;
    text-align: center;
    height: fit-content;
    background: #1b1e23;
    border-radius: 20px;
    padding: 40px 0 40px 0;
    flex-grow: 1;
    & p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #748094;
    }
  }

  & .activity {
    &:last-child {
      border-bottom: none;
    }

    & .info {
      display: flex;
      gap: 10px;
      flex-direction: column;
      > div {
        display: flex;
        gap: 10px;
      }
      & p {
        margin: 0;
      }

      & p.quote {
        padding: 10px 20px;
        gap: 10px;
        background: #14171a;
        border-radius: 10px;
      }
      & .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > div {
          display: flex;
          gap: 10px;
          align-items: center;
          & span {
            font-weight: 400;
            font-size: 14px;
            line-height: 17px;
            color: #718096;
          }
          & .nickname {
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
          }
        }
      }

      & .intro {
        display: flex;
        align-items: center;

        font-weight: 400;
        font-size: 14px;
        line-height: 17px;

        color: #718096;
      }

      & .source {
        display: flex;
        padding: 8px 20px 8px 16px;
        box-sizing: border-box;
        gap: 8px;
        height: 40px;
        width: fit-content;
        background: #1a1e23;
        border: 1px solid #39424c;
        border-radius: 100px;
        > img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
      }
    }
  }
`;

const PageHeader = styled.div<{ tab: string }>`
  display: flex;
  padding-bottom: 8px;
  border-bottom: 1px solid #39424c;
  font-weight: 700;
  font-size: 16px;
  line-height: 28px;
  color: #ffffff;
  white-space: pre;
  column-gap: 40px;

  i {
    color: #39424c;
  }

  .tab {
    cursor: pointer;
    color: #39424c;
  }

  .active {
    color: white;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -10px;
      width: 100%;
      height: 2px;
      background: white;
    }
  }
`;
