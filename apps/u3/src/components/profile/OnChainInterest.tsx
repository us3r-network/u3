import { BigNumber, ethers } from 'ethers';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../constants';
import {
  ERC20Balances,
  NFTData,
  NFTDataListItem,
} from '../../services/profile/types/profile';
import Select from '../common/select/Select';
import { NoItem } from '../common/icons/no-item';

import CrownImg from '../common/assets/imgs/crown.svg';
import ethImage from '../common/assets/imgs/eth.png';
import NFTShower from './credential/NFTShower';
import { ERC20Tokens } from '../airstack/ERC20Tokens';
import { Tokens } from '../airstack/Tokens';

export default function OnChainInterest({
  data,
  wallet,
  ethBalance,
  ...props
}: {
  data: NFTData;
  wallet: ERC20Balances;
  ethBalance: string;
}) {
  return (
    <ContentBox {...props} id="content-scroll">
      <div className="nft">
        <div className="title">
          <span>{`NFT`}</span>
        </div>
        <Tokens />
      </div>
      <div className="wallet">
        <h2>Wallet</h2>
        <div className="wallet-content-box">
          {/* <EthTokenInfo balance={ethBalance} /> */}
          <ERC20Tokens />
        </div>
      </div>
    </ContentBox>
  );
}

function EthTokenInfo({ balance }: { balance: string }) {
  return (
    <TokenInfoBox>
      <div>
        <img src={ethImage} alt="" />
        <div>
          <h3>ETH</h3>
          <span>Ether</span>
        </div>
      </div>
      <span>{ethers.utils.formatEther(balance).substring(0, 4)}</span>
    </TokenInfoBox>
  );
}

function TokenInfo(props: {
  img: string;
  name: string;
  symbol: string;
  balance: string;
  decimals: number;
}) {
  const { img, symbol, name, balance, decimals } = props;
  return (
    <TokenInfoBox>
      <div>
        <img src={img} alt="" />
        <div>
          <h3>{symbol}</h3>
          <span>{name}</span>
        </div>
      </div>
      <span>
        {BigNumber.from(balance)
          .div(BigNumber.from(`1${'0'.repeat(decimals)}`))
          .toNumber()
          .toFixed(2)}
      </span>
    </TokenInfoBox>
  );
}

export function OnChainNoItem() {
  return (
    <ContentBox>
      <div className="no-item">
        <NoItem />
        <p> No items to display</p>
      </div>
    </ContentBox>
  );
}

const TokenInfoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88px;

  border-bottom: 1px solid #14171a;
  > div {
    display: flex;
    gap: 10px;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    h3 {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      color: #ffffff;
    }

    span {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;
      /* identical to box height */

      /* #718096 */

      color: #718096;
    }
  }
  img {
    width: 48px;
    border-radius: 50%;
  }

  > span {
    margin: 0;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    text-align: right;

    color: #ffffff;
  }
`;

function NFTCard({ data }: { data: NFTDataListItem }) {
  return (
    <CardBox>
      <NFTShower url={data?.normalized_metadata?.image || ''} ipfs calcHeight />
      <div className="name">
        <p>{data?.normalized_metadata.name}</p>
        {/* {data?.normalized_metadata.name} */}
        {/* <h3>2.99 SOL</h3> */}
      </div>
    </CardBox>
  );
}

const CardBox = styled.div`
  width: 162px;
  /* height: 225px; */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border: 1px solid #39424c;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 3) / 4);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 2) / 3);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: calc((100% - 20px * 1) / 2);
  }

  img {
    width: 100%;
    aspect-ratio: 1;
  }

  video {
    width: 100%;
    aspect-ratio: 1;
  }

  & > div.name {
    padding: 20px;
    > p {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
      line-height: 19px;
      overflow: hidden;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #ffffff;
    }
  }
`;

const ContentBox = styled.div`
  display: flex;
  gap: 40px;
  .no-item {
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    padding: 40px 20px;
    height: 219px;
    background: #1b1e23;
    border-radius: 20px;
    & p {
      font-weight: 400;
      font-size: 16px;
      line-height: 19px;

      color: #748094;
    }
  }
  .nft {
    flex-grow: 1;
    width: 760px;
    padding: 30px 20px;
    background: #1b1e23;
    border-radius: 20px;
    box-sizing: border-box;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > span {
        font-style: italic;
        font-weight: 700;
        font-size: 24px;
        line-height: 28px;

        color: #ffffff;
      }
      > div {
        width: 300px;
        input {
          width: 100%;
          box-sizing: border-box;
        }
      }
      & select {
        outline: none;
        width: 300px;
        height: 48px;
        background: #1a1e23;
        border: 1px solid #39424c;
        border-radius: 12px;
        color: #ffffff;
        padding: 0 5px;
        appearance: none;
        background-image: url(${CrownImg});
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 1em;
      }
    }
    .data {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      position: relative;
    }
  }

  .wallet {
    width: 360px;
    min-width: 360px;
    box-sizing: border-box;

    background: #1b1e23;
    border-radius: 20px;
    height: fit-content;
    & h2 {
      padding: 20px;
      margin: 0;
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #14171a;

      color: #ffffff;
    }

    > div {
      > div {
        padding: 0 20px;
      }
    }
  }
`;

export const OnChainInterestMobile = styled(OnChainInterest)`
  flex-direction: column;
  padding-bottom: 45px;
  gap: 10px;

  .nft {
    background: transparent;
    width: 100%;
    padding: 0;
    .title {
      & > div {
        width: 133px;
      }
    }

    .select-options-box {
      width: 133px;
      & > div {
        padding: 10px;
        font-size: 12px;
      }
    }

    .data {
      flex-wrap: nowrap;
      overflow-x: auto;
      & > div {
        flex-shrink: 0;
      }
    }
  }

  .wallet {
    background: transparent;
    h2 {
      padding-left: 0;
    }
    .wallet-content-box {
      background: #1b1e23;
      border: 1px solid #39424c;
      border-radius: 20px;
      & > div {
        border-bottom: 1px solid #2a3037;
      }
      & > div:last-of-type {
        border-bottom: none;
      }
    }
  }
`;
