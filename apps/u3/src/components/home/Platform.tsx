/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 10:22:20
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 19:05:59
 * @Description: file description
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Title from './Title';
import { MEDIA_BREAK_POINTS } from '../../constants';
import {
  PlatformsItemResponse,
  PlatformType,
} from '../../services/types/common';
import ImgDefault from '../common/ImgDefault';
import { formatFilterShowName } from '../../utils/filter';
import EllipsisText from '../common/text/EllipsisText';

export default function Platform({
  platforms,
  viewAllAction,
}: {
  platforms: Array<PlatformsItemResponse>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  const settings = {
    className: 'lists',
    infinite: false,
    slidesToShow: 6,
    nextArrow: null,
    prevArrow: null,
  };
  const listScrollState = useRef({
    isDown: false,
    startX: null,
    scrollLeft: null,
  });
  return (
    <Box>
      <Title text="Browse by Platform" />{' '}
      <div
        className="container"
        onMouseDown={(e) => {
          listScrollState.current = {
            isDown: true,
            startX: e.pageX - e.currentTarget.offsetLeft,
            scrollLeft: e.currentTarget.scrollLeft,
          };
          e.currentTarget.classList.add('active');
        }}
        onMouseMove={(e) => {
          if (!listScrollState.current.isDown) return;
          e.preventDefault();
          const x = e.pageX - e.currentTarget.offsetLeft;
          const walk = (x - listScrollState.current.startX) * 2;
          e.currentTarget.scrollLeft =
            listScrollState.current.scrollLeft - walk;
        }}
        onMouseUp={(e) => {
          listScrollState.current.isDown = false;
          e.currentTarget.classList.remove('active');
        }}
      >
        <div className="lists">
          {platforms.map((item) => {
            return (
              <Card
                key={item.platformUrl}
                {...item}
                clickAction={() => {
                  if (item.type === PlatformType.EVENT && item.platformUrl) {
                    navigate(`/events?platform=${item.platform}`);
                    return;
                  }
                  if (item.type === PlatformType.CONTENT) {
                    navigate(`/contents`);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </Box>
  );
}

const Box = styled.div`
  .container {
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    cursor: grab;
  }

  .container:active {
    cursor: grabbing;
  }
  & .lists {
    margin-top: 20px;
    display: flex;
    gap: 20px;
    align-items: center;
    /* display: grid;
    grid-gap: 20px;
    @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
      grid-template-columns: repeat(
        8,
        minmax(calc((100% - 20px * 7) / 8), 1fr)
      );
    }

    @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
      grid-template-columns: repeat(
        7,
        minmax(calc((100% - 20px * 6) / 7), 1fr)
      );
    }

    @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
      grid-template-columns: repeat(
        6,
        minmax(calc((100% - 20px * 5) / 6), 1fr)
      );
    } */
  }
`;

function Card(props: PlatformsItemResponse & { clickAction: () => void }) {
  const { number, platform, platformLogo, type, clickAction } = props;
  return (
    <CardWrapper>
      <CardBox onClick={clickAction}>
        <PlatformImg src={platformLogo} alt="" />
        <h2>{formatFilterShowName(platform)}</h2>
        <div>
          {number} {type === PlatformType.EVENT && 'events'}{' '}
          {type === PlatformType.CONTENT && 'contents'}
        </div>
      </CardBox>
    </CardWrapper>
  );
}
const CardWrapper = styled.div`
  /* flex: 1; */
  width: auto;
  box-sizing: border-box;
  padding: 20px;
  cursor: pointer;
  height: 146px;
  background: #1b1e23;
  border-radius: 20px;
  /* overflow: hidden; */
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const PlatformImg = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;
const CardBox = styled.div`
  width: auto;
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  gap: 10px;

  > h2 {
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    margin: 0;

    text-align: center;

    color: #ffffff;
    white-space: nowrap;
  }
  > div {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #718096;
    white-space: nowrap;
  }
`;
