/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 17:12:51
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 14:36:55
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { DappExploreListItemResponse } from '../../../services/dapp/types/dapp';
import Loading from '../../common/loading/Loading';
import DappExploreListItem from '../../dapp/DappExploreListItem';
import Card, { CardTitle } from './Card';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemResponse[];
  loading?: boolean;
  onItemClick?: (data: DappExploreListItemResponse) => void;
};
export default function Dapps({
  data,
  loading,
  onItemClick,
  ...otherProps
}: Props) {
  return (
    <DappsWrapper {...otherProps}>
      <CardTitle>Dapps</CardTitle>
      {loading ? (
        <ListStatusBox>
          <Loading />
        </ListStatusBox>
      ) : (
        <DappsList>
          {data.map((item) => (
            <DappItem
              key={item.id}
              data={item}
              onClick={() => onItemClick && onItemClick(item)}
            />
          ))}
        </DappsList>
      )}
    </DappsWrapper>
  );
}

const DappsWrapper = styled(Card)`
  width: 100%;
  min-height: 424px;
  display: flex;
  flex-direction: column;
`;
const DappsList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const DappItem = styled(DappExploreListItem)`
  padding: 0;
`;
const ListStatusBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;
