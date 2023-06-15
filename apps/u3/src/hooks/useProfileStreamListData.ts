import { useCallback, useRef, useState } from 'react';

import { getList, PageSize } from '../services/api/activity';
import { Network, Stream } from '../services/types/activity';

export default function useListData({
  network,
  familyOrApp,
  did,
}: {
  network: Network;
  familyOrApp?: string;
  did?: string;
}) {
  const pageNum = useRef(1);
  const [data, setData] = useState<Array<Stream>>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadData = async ({
    network: paramNetwork,
    familyOrApp: paramFamilyOrApp,
    did: paramDid,
  }: {
    network: Network;
    familyOrApp?: string;
    did?: string;
  }) => {
    const resp = await getList({
      network: paramNetwork,
      familyOrApp: paramFamilyOrApp,
      did: paramDid,
    });
    const { streams } = resp.data.data;
    setHasMore(streams.length >= PageSize);
    setData(streams);
    pageNum.current = 1;
  };

  const fetchMoreData = useCallback(
    async (pageNumber: number) => {
      const resp = await getList({ network, pageNumber, familyOrApp, did });
      const { streams } = resp.data.data;
      setHasMore(streams.length >= PageSize);
      setData([...data, ...streams]);
    },
    [data, network, familyOrApp, did]
  );

  return {
    pageNum,
    data,
    setData,
    hasMore,
    setHasMore,
    loadData,
    fetchMoreData,
  };
}
