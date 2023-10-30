import styled from 'styled-components';
import { useRef } from 'react';
import {
  GalxeDataListItem,
  NooxDataListItem,
  PoapData,
} from '../../../services/profile/types/profile';
import NFTShower from './NFTShower';
import { MEDIA_BREAK_POINTS } from '../../../constants';
import { sortPubKey } from '../../../utils/shared/solana';
import { defaultFormatDate } from '../../../utils/shared/time';
import useInfo from './useInfoCalc';

export function NooxCard({
  data,
  oatAction,
}: {
  data: NooxDataListItem;
  oatAction: () => void;
}) {
  const targetRef = useRef<HTMLDivElement>();
  const { infoShow, infoLeft, infoTop, infoShowVisible } = useInfo(targetRef);
  return (
    <Box ref={targetRef} className="card-box">
      <NFTShower url={data?.uriMetaData?.image || ''} ipfs />
      <div className="hover">
        <button type="button" onClick={oatAction}>
          Get The OAT
        </button>
      </div>
      {infoShow && (
        <InfoContainer
          show={infoShow}
          top={infoTop}
          left={infoLeft}
          className={infoShowVisible ? 'visible' : ''}
        >
          <div className="info">{data.uriMetaData?.name}</div>
          <div className="desc">{data.uriMetaData?.description}</div>
          <hr />
          <div className="addr">
            <span>Address</span>
            <span>{sortPubKey(data.address, 6)}</span>
          </div>
        </InfoContainer>
      )}
    </Box>
  );
}

const Box = styled.div`
  display: inline-block;
  width: 198px;
  /* height: 240px; */
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  &:before {
    content: '';
    display: block;
    padding-top: 110%;
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 5) / 6);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 4) / 5);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: calc((100% - 20px * 3) / 4);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.lg}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    width: calc((100% - 20px * 2) / 3);
  }

  img {
    width: 100%;
    height: 100%;
  }

  .hover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
    & button {
      width: 136px;
      height: 41px;
      border: none;
      outline: none;
      background: #ffffff;
      border-radius: 12px;
    }
  }

  &:hover {
    /* .hover {
      display: flex;
    } */
  }
`;

export function GalxeCard({
  data,
  oatAction,
}: {
  data: GalxeDataListItem;
  oatAction: () => void;
}) {
  const targetRef = useRef<HTMLDivElement>();
  const { infoShow, infoLeft, infoTop, infoShowVisible } = useInfo(
    targetRef,
    true
  );
  return (
    <CircleCardBox ref={targetRef} className="card-box">
      <NFTShower url={data?.image || ''} />
      <div className="hover">
        <button type="button" onClick={oatAction}>
          Get The OAT
        </button>
      </div>
      {infoShow && (
        <InfoContainer
          show={infoShow}
          top={infoTop}
          left={infoLeft}
          className={infoShowVisible ? 'visible' : ''}
        >
          <div className="info">{data.name}</div>
          <div className="time">
            {defaultFormatDate(Number(data.createdAt) * 1000)}
          </div>
          <hr />
          <div className="addr">
            <span>Address</span>
            <span>{sortPubKey(data.nftCore.contractAddress, 6)}</span>
          </div>
        </InfoContainer>
      )}
    </CircleCardBox>
  );
}

export function PoapCard({
  data,
  oatAction,
}: {
  data: PoapData;
  oatAction: () => void;
}) {
  const targetRef = useRef<HTMLDivElement>();
  const { infoShow, infoLeft, infoTop, infoShowVisible } = useInfo(
    targetRef,
    true
  );
  return (
    <CircleCardBox ref={targetRef} className="card-box">
      <NFTShower url={data?.event?.image_url || ''} />
      <div className="hover">
        <button type="button" onClick={oatAction}>
          Get The OAT
        </button>
      </div>

      {infoShow && (
        <InfoContainer
          show={infoShow}
          top={infoTop}
          left={infoLeft}
          className={infoShowVisible ? 'visible' : ''}
        >
          <div className="info">{data.event.name}</div>
          <div className="desc">{data.event.description}</div>
          <div className="time">
            {defaultFormatDate(new Date(data.created))}
          </div>
          <hr />
          <div className="addr">
            <span>Owner</span>
            <span>{sortPubKey(data.owner, 6)}</span>
          </div>
        </InfoContainer>
      )}
    </CircleCardBox>
  );
}

export function NoItem({
  msg,
  exploreAction,
}: {
  msg: string;
  exploreAction: () => void;
}) {
  return (
    <NoItemBox className="no-item">
      <p>{msg}</p>
      <button type="button" onClick={exploreAction}>
        Explore
      </button>
    </NoItemBox>
  );
}

const NoItemBox = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 167px;

  background: #1b1e23;
  border-radius: 20px;

  & p {
    margin: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #748094;
  }

  & button {
    padding: 12px 24px;
    cursor: pointer;
    width: 115px;
    height: 48px;

    background: #1a1e23;
    border: 1px solid #39424c;
    border-radius: 12px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: #718096;
  }
`;

const CircleCardBox = styled.div`
  display: inline-block;
  width: 198px;

  /* height: 198px; */
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  &:before {
    content: '';
    display: block;
    padding-top: 100%;
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 5) / 6);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc((100% - 20px * 4) / 5);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    width: calc((100% - 20px * 3) / 4);
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xl}px) {
    width: calc((100% - 20px * 2) / 3);
  }

  img {
    width: 100%;
    height: 100%;
  }

  video {
    width: 100%;
  }

  .hover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));

    & button {
      width: 136px;
      height: 41px;
      border: none;
      outline: none;
      background: #ffffff;
      border-radius: 12px;
    }
  }

  &:hover {
    /* .hover {
      display: flex;
    } */
  }
`;

const InfoContainer = styled.div<{ show: boolean; top: number; left: number }>`
  position: fixed;
  width: 340px;
  height: fit-content;
  background-color: #1b1e23;
  z-index: 100;
  opacity: 0;
  visibility: 'hidden';
  left: ${(props) => `${props.left}px`};
  top: ${(props) => `${props.top}px`};
  border: 1px solid #39424c;
  border-radius: 10px;
  transition: opacity 0.2s linear;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  color: #fff;

  &.visible {
    visibility: visible;
    opacity: 1;
  }

  & hr {
    width: 100%;
    background: #39424c;
    border-color: #39424c;
    margin: 0;
  }
  & div.info {
    font-weight: 700;
    font-size: 18px;
    line-height: 21px;
  }

  & div.desc {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  & div.time,
  & div.addr {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;

    color: #718096;
  }
  & div.addr {
    /* position: absolute;
    bottom: 20px; */
    color: #718096;
    display: flex;
    justify-content: space-between;
  }
`;
