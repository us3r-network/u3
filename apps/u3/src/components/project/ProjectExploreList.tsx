/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 12:07:59
 * @Description: file description
 */
import { useCallback } from 'react';
import styled from 'styled-components';
import ProjectExploreListItem, {
  ProjectExploreListItemData,
} from './ProjectExploreListItem';

export type ProjectExploreListProps = {
  data: ProjectExploreListItemData[];
  installPendingIds?: Array<string | number>;
  onInstall?: (item: ProjectExploreListItemData) => void;
  onOpen?: (item: ProjectExploreListItemData) => void;
  onItemClick?: (item: ProjectExploreListItemData) => void;
};
export default function ProjectExploreList({
  data,
  installPendingIds = [],
  onInstall,
  onOpen,
  onItemClick,
}: ProjectExploreListProps) {
  const loadingInstall = useCallback(
    (id: string | number) => installPendingIds.includes(id),
    [installPendingIds]
  );
  return (
    <ProjectExploreListWrapper>
      {data.map((item) => {
        return (
          <ProjectExploreListItem
            key={item.id}
            data={item}
            isInstalled={!!item?.favored}
            loadingInstall={loadingInstall(item.id)}
            disabledInstall={!!item?.favored || loadingInstall(item.id)}
            onInstall={() => onInstall && onInstall(item)}
            onOpen={() => onOpen && onOpen(item)}
            onClick={() => onItemClick && onItemClick(item)}
            displayButtons={!!item.url}
          />
        );
      })}
    </ProjectExploreListWrapper>
  );
}
const ProjectExploreListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(calc((100% - 0px) / 3), 1fr));
  & > div {
    & {
      border-bottom: 1px solid rgba(57, 66, 76, 0.5);
      border-right: 1px solid rgba(57, 66, 76, 0.5);
    }
    &:nth-child(3n) {
      border-right: none;
    }
  }
`;
