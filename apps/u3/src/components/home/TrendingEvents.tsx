import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import Badge from '../news/contents/Badge';
import { EventExploreListItemResponse } from '../../services/news/types/event';
import isUrl from '../../utils/shared/isUrl';
import RewardTag from '../news/event/RewardTag';
import { Reward } from '../../services/shared/types/common';
import EventExploreGridListItem from '../news/event/EventExploreGridListItem';

export default function TrendingEvents({
  data,
  viewAllAction,
}: {
  data: EventExploreListItemResponse[];
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Trending Events" viewAllAction={viewAllAction} />{' '}
      <div className="lists">
        {data.map((item) => {
          return (
            <EventExploreGridListItem
              data={item}
              key={item.id || item.uuid}
              onClick={() => {
                navigate(`/events/${item.uid || item.id}`);
              }}
            />
          );
        })}
      </div>
    </Box>
  );
}

const Box = styled.div`
  & .lists {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
`;

function Card({
  title,
  img,
  author,
  reward,
  clickAction,
}: {
  title: string;
  img: string;
  author: string;
  reward: Reward;
  clickAction: () => void;
}) {
  return (
    <CardWrapper>
      <CardBox onClick={clickAction}>
        <EventImg src={img} />
        <BottomBox>
          <EventTitle>{title}</EventTitle>
          <EventRewardTagBox>
            <RewardTag value={reward} />
          </EventRewardTagBox>

          <EventAuthor>{author}</EventAuthor>
        </BottomBox>
      </CardBox>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  flex: 1;
  height: 315px;
  cursor: pointer;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const CardBox = styled.div`
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
`;
const EventImg = styled.img`
  width: 100%;
  height: 178px;
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
const BottomBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;
const EventTitle = styled.span`
  margin: 0;
  padding: 0;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;

  color: #ffffff;

  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;
`;
const EventAuthor = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;

  color: #718096;
`;
const EventRewardTagBox = styled.div`
  div {
    width: fit-content;
  }
`;
