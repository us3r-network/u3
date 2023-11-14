/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:42:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 11:40:06
 * @Description: file description
 */
import styled from 'styled-components';
import { LinkListItem } from 'src/services/news/types/links';
import AnimatedListItem, {
  useAnimatedListTransition,
} from '../../../common/animation/AnimatedListItem';
import { MEDIA_BREAK_POINTS } from '../../../../constants';
import GridItem from './GridItem';

export type LinkGridListProps = {
  data: LinkListItem[];
  // activeLink: LinkListItem | null;
  onItemClick?: (item: LinkListItem) => void;
};

export default function LinkGridList({
  data,
  // activeLink,
  onItemClick,
}: LinkGridListProps) {
  const transitions = useAnimatedListTransition(data);
  return (
    <ContentGridListWrapper>
      {transitions((styles, item) => {
        // const isActive = item.url === activeLink.url;
        return (
          <AnimatedListItem key={item.url} styles={{ ...styles }}>
            <GridItem
              data={item}
              clickAction={() => onItemClick && onItemClick(item)}
            />
          </AnimatedListItem>
        );
      })}
    </ContentGridListWrapper>
  );
}
const ContentGridListWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(6, minmax(calc((100% - 20px * 3) / 4), 1fr));
  /* @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 5) / 6), 1fr));
  } */

  /* @media (min-width: ${MEDIA_BREAK_POINTS.xxl}px) and (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 4) / 5), 1fr));
  } */

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(6, minmax(calc((100% - 20px * 2) / 3), 1fr));
  }
`;
