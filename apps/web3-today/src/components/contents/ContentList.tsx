/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 15:24:04
 * @Description: file description
 */
import styled from 'styled-components';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../animation/AnimatedListItem';
import ListItem, { ListItemHidden } from './ListItem';

export type ContentExploreListItemData = {
  id: string | number;
  uuid?: string;
  value?: string;
  link?: string;
  createdAt?: number;
  title?: string;
  hidden?: boolean;
  linkStreamId?: string;
};

export type ContentListProps = {
  data: ContentExploreListItemData[];
  activeId: string | number;
  onHiddenUndo?: (item: ContentExploreListItemData) => void;
  onItemClick?: (item: ContentExploreListItemData) => void;
};
export default function ContentList({
  data,
  activeId,
  onHiddenUndo,
  onItemClick,
}: ContentListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <ContentListWrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            {item.hidden ? (
              <ListItemHidden
                isActive={String(item.id || item.uuid) === String(activeId)}
                hidden
                undoAction={() => onHiddenUndo && onHiddenUndo(item)}
              />
            ) : (
              <ListItem
                data={item}
                isActive={String(item.id || item.uuid) === String(activeId)}
                clickAction={() => onItemClick && onItemClick(item)}
              />
            )}
          </AnimatedListItem>
        );
      })}
    </ContentListWrapper>
  );
}
const ContentListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
