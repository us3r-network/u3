import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useSession } from '@us3r-network/auth-with-rainbowkit';
import ListTable from './ListTable';

import useListData from '../../hooks/useProfileStreamListData';

import { Network, Stream } from '../../services/types/activity';

const network = 'TESTNET' as Network;

export default function StreamPage() {
  const session = useSession();
  const did = session?.id;

  const navigate = useNavigate();
  const { pageNum, data, hasMore, loadData, fetchMoreData } = useListData({
    network,
    did,
  });

  useEffect(() => {
    if (!network || !did) return;
    loadData({ network, did });
  }, [network, did]);

  // const pubkey = useMemo(() => {
  //   if (!did) return "";
  //   return did;
  // }, [did]);

  return (
    <>
      <InfiniteScroll
        dataLength={data.length}
        next={() => {
          pageNum.current += 1;
          fetchMoreData(pageNum.current);
        }}
        hasMore={hasMore}
        loader={<Loading>Loading...</Loading>}
      >
        <ListTable data={data} network={network?.toLowerCase()} />
      </InfiniteScroll>
      {!hasMore && <Loading>no more data</Loading>}
    </>
  );
}

const Loading = styled.div`
  padding: 20px;
  text-align: center;
  color: gray;
`;
