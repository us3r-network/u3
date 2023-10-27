import { useRef } from 'react';
import styled from 'styled-components';
import { EventExploreListItemResponse } from '../../../services/news/types/event';
import isUrl from '../../../utils/shared/isUrl';
import EllipsisText from '../../common/text/EllipsisText';
import RewardTag from '../event/RewardTag';

import TitleMobile from './TitleMobile';

export default function RecommendEventMobile({
  data,
  viewAllAction,
}: {
  data: Array<EventExploreListItemResponse & { recReason?: string }>;
  viewAllAction?: () => void;
}) {
  const listScrollState = useRef({
    isDown: false,
    startX: null,
    scrollLeft: null,
  });
  return (
    <Wrapper>
      <TitleMobile text="Recommended Events" viewAllAction={viewAllAction} />
      <div className="container">
        <div
          className="lists"
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
          {data.map((item) => {
            return (
              <EventListItemMobile key={item.id || item.name} data={item} />
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  .container {
    margin-top: 10px;
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    cursor: grab;
  }

  .container:active {
    cursor: grabbing;
  }
  & .lists {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`;

type EventListItemMobileProps = {
  data: EventExploreListItemResponse;
};
function EventListItemMobile({ data }: EventListItemMobileProps) {
  const { name, image, reward, project, platform } = data;
  const img = isUrl(image)
    ? image
    : isUrl(project?.image)
    ? project.image
    : isUrl(platform?.logo)
    ? platform.logo
    : '';
  return (
    <CardWrapper>
      <TopBox>
        <EventImg src={img} />
        <PlatformIcon src={data.platform.logo} title={data.link} />
      </TopBox>
      <BottomBox>
        <EventTitle row={2}>{name}</EventTitle>
        <EventRewardTagBox>
          <RewardTag value={reward} />
        </EventRewardTagBox>
      </BottomBox>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  isolation: isolate;

  width: 200px;
  height: 294px;

  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 10px;
  overflow: hidden;

  flex: none;
  order: 0;
  flex-grow: 0;
`;
const TopBox = styled.div`
  width: 100%;
  height: 200px;
  position: relative;
`;
const EventImg = styled.img`
  width: 100%;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
  object-fit: cover;
  &:before {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: inherit;
    padding: 2px;
    box-sizing: border-box;
  }
`;
const PlatformIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  right: 20px;
  bottom: 0px;
  transform: translateY(50%);
`;
const BottomBox = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  padding-top: 20px;
  box-sizing: border-box;
`;
const EventTitle = styled(EllipsisText)`
  width: 100%;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const EventRewardTagBox = styled.div`
  div {
    width: fit-content;
  }
`;
