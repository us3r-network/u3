/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:30:56
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ContentListItem } from '../../../services/news/types/contents';
import GridItem from '../../news/contents/GridItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ContentListItem[];
  onItemClick?: (data: ContentListItem) => void;
};
export default function Conents({ data, onItemClick, ...otherProps }: Props) {
  return (
    <ConentsWrapper {...otherProps}>
      <CardTitle>Conents({data.length})</CardTitle>
      <ConentsList>
        {data.map((item) => (
          <GridItem
            data={item}
            key={item.id}
            clickAction={() => onItemClick && onItemClick(item)}
          />
        ))}
      </ConentsList>
    </ConentsWrapper>
  );
}

const ConentsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
`;
const ConentsList = styled.div`
  margin-top: 20px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
`;
