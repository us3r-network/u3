/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-20 14:29:34
 * @Description: file description
 */
import styled from 'styled-components';
import EventExploreListItem, { styleMaps } from './EventExploreListItem';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import { ChainType, Reward } from '../../services/types/common';

export type EventExploreListItemData = {
  id: number | string;
  name: string;
  link: string;
  supportIframe: boolean;

  uuid?: string;
  reward?: Reward;
  endTime?: number;
  platform?: {
    name: string;
    logo: string;
  };
  chain?: ChainType;
  linkStreamId?: string;
  editorScore?: number;
};

export type EventExploreListProps = {
  data: EventExploreListItemData[];
  activeId: number | string;
  onItemClick?: (item: EventExploreListItemData) => void;
};

export default function EventExploreList({
  data,
  activeId,
  onItemClick,
}: EventExploreListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <EventExploreListWrapper>
      {transitions((styles, item) => {
        const bgc = styleMaps[item?.platform?.name]?.bgc;
        return (
          <AnimatedListItem
            key={item.id}
            styles={{ ...styles }}
            bottomFaceBgc={bgc}
          >
            <EventExploreListItem
              data={item}
              isActive={String(item.id || item.uuid) === String(activeId)}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </EventExploreListWrapper>
  );
}
const EventExploreListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
