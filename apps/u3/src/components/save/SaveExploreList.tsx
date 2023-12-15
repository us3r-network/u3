/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 10:19:49
 * @FilePath: /u3/apps/u3/src/components/save/SaveExploreList.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../common/animation/AnimatedListItem';
import SaveExploreListItem from './SaveExploreListItem';
import { MEDIA_BREAK_POINTS } from '@/constants';

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
const SaveExploreListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(calc((100% - 20px * 3) / 4), 1fr));

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 2) / 3), 1fr));
  }
`;
