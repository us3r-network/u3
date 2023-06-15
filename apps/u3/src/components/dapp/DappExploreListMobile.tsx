/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:15:13
 * @Description: file description
 */
import styled from 'styled-components';
import {
  DappExploreListItemData,
  DappExploreListItemMobile,
} from './DappExploreListItem';

export type DappExploreListProps = {
  data: DappExploreListItemData[];
  onItemClick?: (item: DappExploreListItemData) => void;
};
export default function DappExploreListMobile({
  data,
  onItemClick,
}: DappExploreListProps) {
  return (
    <DappExploreListWrapper>
      {data.map((item) => {
        return (
          <DappExploreListItemMobile
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
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
