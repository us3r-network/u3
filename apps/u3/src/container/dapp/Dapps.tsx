/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:37:56
 * @Description:
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { isMobile } from 'react-device-detect';
import {
  fetchMoreDappExploreList,
  fetchDappExploreList,
  selectAll,
  selectState,
} from '../../features/dapp/dappExploreList';
import { AsyncRequestStatus } from '../../services/shared/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  DappExploreListFilterValues,
  defaultDappExploreListFilterValues,
} from '../../components/dapp/DappExploreListFilter';
import { DappExploreListItemResponse } from '../../services/dapp/types/dapp';
import DappsPageMobile from '../../components/dapp/DappsPageMobile';
import DappsPage from '../../components/dapp/DappsPage';
import useDappsSearchParams from '../../hooks/dapp/useDappsSearchParams';

export type DappsPageProps = {
  // Queries
  dapps: DappExploreListItemResponse[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  isEmpty?: boolean;
  filter?: DappExploreListFilterValues;
  filterChange?: (values: DappExploreListFilterValues) => void;
  noMore?: boolean;
  getMore?: () => void;
  // Mutations
  // Others
};

export default function Dapps() {
  const dispatch = useAppDispatch();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dapps = useAppSelector(selectAll);
  const { currentSearchParams, searchParamsChange } = useDappsSearchParams();
  useEffect(() => {
    dispatch(fetchDappExploreList({ ...currentSearchParams }));
  }, [currentSearchParams]);

  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const isEmpty = useMemo(() => !dapps.length, [dapps]);

  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const getMore = useCallback(
    () => dispatch(fetchMoreDappExploreList(currentSearchParams)),
    [currentSearchParams]
  );

  return isMobile ? (
    <DappsPageMobile
      // Queries
      dapps={dapps}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      isEmpty={isEmpty}
      filter={currentSearchParams}
      filterChange={searchParamsChange}
      noMore={noMore}
      getMore={getMore}
    />
  ) : (
    <DappsPage
      // Queries
      dapps={dapps}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      isEmpty={isEmpty}
      filter={currentSearchParams}
      filterChange={searchParamsChange}
      noMore={noMore}
      getMore={getMore}
    />
  );
}
