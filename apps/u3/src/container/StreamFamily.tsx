import styled from 'styled-components';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Network, Stream } from '../services/types/activity';

import PageTitle from '../components/common/PageTitle';
import { MainWrapper } from '../components/layout/Index';
import useListData from '../hooks/useProfileStreamListData';

import ListTable from '../components/activity/ListTable';

const network = 'TESTNET' as Network;

function StreamPage() {
  const { familyOrApp } = useParams();
  const navigate = useNavigate();
  const { pageNum, data, hasMore, loadData, fetchMoreData } = useListData({
    network,
    familyOrApp,
  });

  useEffect(() => {
    if (!network || !familyOrApp) return;
    loadData({ network, familyOrApp });
  }, [network, familyOrApp]);

  return (
    <Wrapper>
      <PageTitle>
        Activity for the family: <span>{familyOrApp}</span>
      </PageTitle>
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          pageNum.current += 1;
          fetchMoreData(pageNum.current);
        }}
        hasMore={hasMore}
        loader={<Loading>Loading...</Loading>}
      >
        <ListTable data={data} network={network?.toLowerCase()} showDid />
      </InfiniteScroll>
      {!hasMore && <Loading>no more data</Loading>}
    </Wrapper>
  );
}
export default StreamPage;

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Loading = styled.div`
  padding: 20px;
  text-align: center;
  color: gray;
`;
