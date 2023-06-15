import styled from 'styled-components';
import { SaveExploreListItemMobile } from './SaveExploreListItem';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import CardBase from '../common/card/CardBase';
import type { SaveExploreListItemData } from './SaveExploreList';

export type SaveExploreListProps = {
  data: SaveExploreListItemData[];
  onItemClick?: (item: SaveExploreListItemData) => void;
};

export default function SaveExploreListMobile({
  data,
  onItemClick,
}: SaveExploreListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <SaveExploreListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <SaveExploreListItemMobile
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </SaveExploreListWrapper>
  );
}
const SaveExploreListWrapper = styled(CardBase)`
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  overflow: visible;
  & > div {
    & {
      border: 1px solid rgba(57, 66, 76, 0.5);
      border-radius: 10px;
      margin-bottom: 10px;
    }
    &:last-child:not(:first-child) {
      margin-bottom: none;
    }
  }
`;
