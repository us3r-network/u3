/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-08 14:04:04
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 17:42:47
 * @Description: file description
 */
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../../../common/animation/AnimatedListItem';
import LinkListItemMobile from './LinkListItemMobile';

export type LinkListMobileProps = {
  data: LinkListItem[];
  onItemClick?: (item: LinkListItem) => void;
};
export default function LinkListMobile({
  data,
  onItemClick,
}: LinkListMobileProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <Wrapper>
      {transitions((styles, item) => {
        return (
          <AnimatedListItem key={item.url} styles={{ ...styles }}>
            <LinkListItemMobile
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
