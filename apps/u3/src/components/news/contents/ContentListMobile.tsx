/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 14:53:11
 * @Description: file description
 */
import styled from 'styled-components';
import { ContentListItem } from '../../../services/news/types/contents';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../../common/animation/AnimatedListItem';
import ContentListItemMobile from './ContentListItemMobile';

export type ContentListMobileProps = {
  data: ContentListItem[];
  onItemClick?: (item: ContentListItem) => void;
};
export default function ContentListMobile({
  data,
  onItemClick,
}: ContentListMobileProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <Wrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.id} styles={{ ...styles }}>
            <ContentListItemMobile
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
