/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-13 17:20:50
 * @Description: file description
 */
import styled from 'styled-components';
import EventExploreGridListItem, {
  EventExploreGridListItemData,
} from './EventExploreGridListItem';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../../common/animation/AnimatedListItem';
import { MEDIA_BREAK_POINTS } from '../../../constants';

export type EventExploreGridListProps = {
  data: EventExploreGridListItemData[];
  onItemClick?: (item: EventExploreGridListItemData) => void;
};

export default function EventExploreGridList({
  data,
  onItemClick,
}: EventExploreGridListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <EventExploreGridListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <EventExploreGridListItem
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </EventExploreGridListWrapper>
  );
}
const EventExploreGridListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 4) / 5), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 3) / 4), 1fr));
  }
`;
