/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 15:35:43
 * @Description: file description
 */
import styled from 'styled-components';
import { MEDIA_BREAK_POINTS } from '../../constants';
import DappExploreListItem, {
  DappExploreListItemData,
} from './DappExploreListItem';

export type DappExploreListProps = {
  data: DappExploreListItemData[];
  onItemClick?: (item: DappExploreListItemData) => void;
};
export default function DappExploreList({
  data,
  onItemClick,
}: DappExploreListProps) {
  return (
    <DappExploreListWrapper>
      {data.map((item) => {
        return (
          <DappExploreListItem
            key={item.id}
            data={item}
            onClick={() => onItemClick && onItemClick(item)}
          />
        );
      })}
    </DappExploreListWrapper>
  );
}
const DappExploreListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(3, minmax(calc((100% - 20px * 2) / 3), 1fr));
  @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(3, minmax(calc((100% - 20px * 2) / 3), 1fr));
  }

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(3, minmax(calc((100% - 20px * 1) / 2), 1fr));
  }

  @media (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(1);
  }
`;
