import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import { DappExploreListItemResponse } from '../../../services/dapp/types/dapp';
import EllipsisText from '../../common/text/EllipsisText';
import ImgDefault from '../../common/ImgDefault';

export type RecommendDappItemData = DappExploreListItemResponse;
export type RecommendDappItemProps = StyledComponentPropsWithRef<'div'> & {
  data: RecommendDappItemData;
};
export default function RecommendDappItem({
  data,
  ...props
}: RecommendDappItemProps) {
  return (
    <Wrapper {...props}>
      <ListItemInner>
        <ItemImg src={data.image} />
        <InnerCenter>
          <ItemName>{data.name}</ItemName>
          <InnerDesc>{data.description}</InnerDesc>
        </InnerCenter>
      </ListItemInner>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
`;

const ItemImg = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  flex-shrink: 0;
`;
const InnerCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
`;
const ItemName = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const InnerDesc = styled(EllipsisText)`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #718096;
`;

export const RecommendDappItemMobile = styled(RecommendDappItem)`
  padding: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;
  border-radius: 10px;
`;
