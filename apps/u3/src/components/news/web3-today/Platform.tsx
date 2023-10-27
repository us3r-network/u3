import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import Title from './Title';
import {
  PlatformsItemResponse,
  PlatformType,
} from '../../../services/shared/types/common';
import ImgDefault from '../../common/ImgDefault';
import { formatFilterShowName } from '../../../utils/shared/filter';

export default function Platform({
  platforms,
}: {
  platforms: Array<PlatformsItemResponse>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
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
  width: auto;
  box-sizing: border-box;
  padding: 20px;
  cursor: pointer;
  height: 146px;
  background: #1b1e23;
  border-radius: 20px;
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
