import styled from 'styled-components';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../common/animation/AnimatedListItem';
import CardBase from '../common/card/CardBase';
import SaveExploreListItem from './SaveExploreListItem';

export type SaveExploreListItemData = {
  id: string;
  url?: string;
  title?: string;
  logo?: string;
  createAt?: string;
};

export type SaveExploreListProps = {
  data: SaveExploreListItemData[];
  onItemClick?: (item: SaveExploreListItemData) => void;
};

export default function SaveExploreList({
  data,
  onItemClick,
}: SaveExploreListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <SaveExploreListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <SaveExploreListItem
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
  & > div {
    & {
      border-bottom: 1px solid rgba(57, 66, 76, 0.5);
    }
    &:last-child:not(:first-child) {
      border-bottom: none;
    }
  }
`;
