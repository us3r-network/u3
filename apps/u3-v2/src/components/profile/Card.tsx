import styled from 'styled-components'
import { GalxeDataListItem, NooxDataListItem, PoapData } from '../../api/index'
import NFTShower from './NFTShower'
import { MEDIA_BREAK_POINTS } from '../../constants'

export function NooxCard({ data }: { data: NooxDataListItem }) {
  return (
    <Box className="card-box">
      <NFTShower url={data?.uriMetaData?.image || ''} ipfs />
    </Box>
  )
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

  /* @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
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
  } */

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
`

export function GalxeCard({ data }: { data: GalxeDataListItem }) {
  return (
    <CircleCardBox className="card-box">
      <NFTShower url={data?.image || ''} />
    </CircleCardBox>
  )
}

export function PoapCard({ data }: { data: PoapData }) {
  return (
    <CircleCardBox className="card-box">
      <NFTShower url={data?.event?.image_url || ''} />
    </CircleCardBox>
  )
}

export function NoItem({
  msg,
  exploreAction,
}: {
  msg: string
  exploreAction: () => void
}) {
  return (
    <NoItemBox className="no-item">
      <p>{msg}</p>
      <button type="button" onClick={exploreAction}>
        Explore
      </button>
    </NoItemBox>
  )
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
`

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
  /* 
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
  } */

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
`
