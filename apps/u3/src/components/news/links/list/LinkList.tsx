/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-15 14:46:22
 * @Description: file description
 */
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import ListItem from './ListItem';

export type LinkListProps = {
  data: LinkListItem[];
  activeLink: LinkListItem | null;
  onItemClick?: (item: LinkListItem) => void;
};
export default function LinkList({
  data,
  activeLink,
  onItemClick,
}: LinkListProps) {
  return (
    <LinkListWrapper>
      {data.map((item) => {
        return (
          <ListItem
            key={item.url}
            data={item}
            isActive={item.url === activeLink?.url}
            clickAction={() => onItemClick && onItemClick(item)}
          />
        );
      })}
    </LinkListWrapper>
  );
}

const LinkListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
