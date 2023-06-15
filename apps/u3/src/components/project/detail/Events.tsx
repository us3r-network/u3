/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:43:46
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { EventExploreListItemResponse } from '../../../services/types/event';
import EventExploreGridListItem from '../../event/EventExploreGridListItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: EventExploreListItemResponse[];
  onItemClick?: (data: EventExploreListItemResponse) => void;
};
export default function Events({ data, onItemClick, ...otherProps }: Props) {
  return (
    <EventsWrapper {...otherProps}>
      <CardTitle>Events({data.length})</CardTitle>
      <EventsList>
        {data.map((item) => (
          <EventExploreGridListItem
            key={item.id}
            data={item}
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}
      </EventsList>
    </EventsWrapper>
  );
}

const EventsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
`;
const EventsList = styled.div`
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
`;
