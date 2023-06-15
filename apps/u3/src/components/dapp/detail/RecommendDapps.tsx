/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:27:04
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { DappExploreListItemResponse } from '../../../services/types/dapp';
import Loading from '../../common/loading/Loading';
import { DappExploreListItemMobile } from '../DappExploreListItem';
import Card, { CardTitle } from './Card';
import RecommendDappItem from './RecommendDappItem';
import { SectionTitle } from './SectionTitle';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemResponse[];
  loading?: boolean;
  onItemClick?: (data: DappExploreListItemResponse) => void;
};
export default function RecommendDapps({
  data,
  loading,
  onItemClick,
  ...otherProps
}: Props) {
  return (
    <RecommendDappsWrapper {...otherProps}>
      <CardTitle>Recommended</CardTitle>
      {loading ? (
        <ListStatusBox>
          <Loading />
        </ListStatusBox>
      ) : (
        <RecommendDappsList>
          {data.map((item) => (
            <RecommendDappItem
              key={item.id}
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          ))}
        </RecommendDappsList>
      )}
    </RecommendDappsWrapper>
  );
}

const RecommendDappsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
  display: flex;
  flex-direction: column;
`;
const RecommendDappsList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ListStatusBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export function RecommendDappsMobile({
  data,
  loading,
  onItemClick,
  ...otherProps
}: Props) {
  return (
    <RecommendDappsWrapperMobile {...otherProps}>
      <SectionTitle>Recommended</SectionTitle>
      {loading ? (
        <ListStatusBox>
          <Loading />
        </ListStatusBox>
      ) : (
        <RecommendDappsListMobile>
          {data.map((item) => (
            <DappExploreListItemMobile
              key={item.id}
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          ))}
        </RecommendDappsListMobile>
      )}
    </RecommendDappsWrapperMobile>
  );
}

const RecommendDappsWrapperMobile = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const RecommendDappsListMobile = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
