/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-03 14:03:05
 * @Description:
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../layout/Index';
import ListScrollBox from '../common/box/ListScrollBox';
import Loading from '../common/loading/Loading';
import NoResult from '../layout/NoResult';
import DappExploreListFilter from './DappExploreListFilter';
import DappExploreList from './DappExploreList';
import type { DappsPageProps } from '../../container/dapp/Dapps';

export default function DappsPage({
  // Queries
  dapps,
  isLoading,
  isLoadingMore,
  isEmpty,
  filter,
  filterChange,
  noMore,
  getMore,
}: // Others
DappsPageProps) {
  const navigate = useNavigate();

  return (
    <DappsPageWrapper>
      <MainBox>
        <FilterBox>
          <DappExploreListFilter values={filter} onChange={filterChange} />
        </FilterBox>

        <ListBox>
          {isLoading ? (
            <Loading />
          ) : isEmpty ? (
            <NoResult />
          ) : (
            <ListScrollBox
              onScrollBottom={() => {
                getMore();
              }}
            >
              <DappExploreList
                data={dapps}
                onItemClick={(item) => navigate(`/apps/${item.id}`)}
              />
              {isLoadingMore ? (
                <MoreLoading>
                  <Loading />
                </MoreLoading>
              ) : noMore ? (
                <MoreLoading>No other dapps</MoreLoading>
              ) : null}
            </ListScrollBox>
          )}
        </ListBox>
      </MainBox>
    </DappsPageWrapper>
  );
}
const DappsPageWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: auto;
`;
const MainBox = styled.div`
  width: 100%;
  height: calc(100vh - 48px);
  display: flex;
  gap: 40px;
`;
const FilterBox = styled.div`
  width: 260px;
  height: 100%;
  overflow-y: auto;
`;
const ListBox = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MoreLoading = styled.div`
  padding: 20px;
  color: #748094;
  display: flex;
  justify-content: center;
`;
