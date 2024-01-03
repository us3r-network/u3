/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 14:32:21
 * @Description:
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MainWrapper } from '../layout/Index';
import ListScrollBox from '../common/box/ListScrollBox';
import Loading from '../common/loading/Loading';
import NoResult from '../layout/NoResult';
import type { DappsPageProps } from '../../container/dapp/Dapps';
import DappExploreListMobile from './DappExploreListMobile';

export default function DappsPageMobile({
  // Queries
  dapps,
  isLoading,
  isLoadingMore,
  isEmpty,
  noMore,
  getMore,
}: DappsPageProps) {
  const navigate = useNavigate();

  return (
    <DappsPageMobileWrapper>
      {isLoading ? (
        <div className="loading">
          <Loading />
        </div>
      ) : isEmpty ? (
        <MainBody>
          <NoResult />
        </MainBody>
      ) : (
        <MainBody
          onScrollBottom={() => {
            getMore();
          }}
        >
          <DappExploreListMobile
            data={dapps}
            onItemClick={(item) => navigate(`/apps/${item.id}`)}
          />
          {isLoadingMore ? (
            <MoreLoading>loading ...</MoreLoading>
          ) : noMore ? (
            <MoreLoading>No other dapps</MoreLoading>
          ) : null}
        </MainBody>
      )}
    </DappsPageMobileWrapper>
  );
}
const DappsPageMobileWrapper = styled(MainWrapper)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  & .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;
const MainBody = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;
const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
