import dayjs from 'dayjs';
import styled from 'styled-components';
import { UserAvatar } from '@us3r-network/profile';
import Badge from '../news/contents/Badge';
import { Copy } from '../common/icons/copy';
import { CurrencyETH } from '../common/icons/currency-eth';
import { GasPump } from '../common/icons/gas-pump';
import Rss3Content from '../fren/Rss3Content';

export default function Activities() {
  return (
    <ContentBox>
      <div className="lists">
        <Rss3Content
          address={['0x74667801993b457b8ccf19d03bbbaa52b7fff43b']}
          empty={<NoActivities />}
        />
      </div>
      {/* {(transList.length > 0 &&
        transList.map((item, idx) => {
          return (
            <div className="lists">
              <ActivityItem key={item.id} {...item} />
            </div>
          );
        })) || <NoActivities />} */}
    </ContentBox>
  );
}

export function NoActivities() {
  return (
    <div className="no-item">
      <CurrencyETH />
      <p>No transactions found on Ethereum.</p>
    </div>
  );
}

function ActivityItem({ id }: { id: number }) {
  return (
    <ActivityBox className="activity">
      <ActivityAvatar />
      <div className="info">
        <div className="header">
          <div>
            <span className="nickname">Nicole</span>
            <span>fas...df</span>
            <span
              onClick={() => {
                // TODO
              }}
            >
              <Copy />
            </span>
          </div>
          <div>
            <GasPump /> gasFee
          </div>
        </div>
        <div className="intro">
          <Badge text="Badge" />
          <span>fasdfasf</span> | <span>{dayjs('1999-01-01').fromNow()}</span>
        </div>
        <p className="contents">
          I am afraid looking how things are we are going towards this direction
        </p>
        <p className="quote">
          A Cosmos app chain that honors Apples 30% fee on gas at the protocol
          level... Its called iChain. DM me if you want access to the 🍏Seed
          round... 😉
        </p>
        <div className="source">
          <img
            src="https://arweave.net/QeSUFwff9xDbl4SCXlOmEn0TuS4vPg11r2_ETPPu_nk"
            alt=""
          />
          Opensea
        </div>
      </div>
    </ActivityBox>
  );
}

const ContentBox = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 40px;
  width: 100%;
  padding-bottom: 24px;
  /* > div {
    max-height: calc(100vh - 170px - 24px - 24px - 73px - 40px);
    height: fit-content;
  } */

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

  & .lists {
    background: #1b1e23;
    border-radius: 20px;
    padding: 0 20px;
    flex-grow: 1;
    display: flex;
    min-width: 37.5rem;
    /* max-height: 700px; */
    height: fit-content;
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

const ActivityBox = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #39424c;
  color: #ffffff;
`;

const ActivityAvatar = styled(UserAvatar)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;
