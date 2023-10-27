/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 09:39:48
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import useDappsSearchParams from '../../../hooks/dapp/useDappsSearchParams';
import Filter from '../../dapp/DappExploreListFilterMobile';
import MobileHeaderLayout from './MobileHeaderLayout';

export default function MobileDappHeader({
  type,
}: {
  type: 'list' | 'detail';
}) {
  const name = type === 'detail' ? 'Dapp Intriduction' : 'Dapp Store';
  const { currentSearchParams, searchParamsChange, searchParamsReset } =
    useDappsSearchParams();
  const [cacheSearchParams, setCacheSearchParams] =
    useState(currentSearchParams);
  useEffect(() => {
    setCacheSearchParams(currentSearchParams);
  }, [currentSearchParams]);
  return (
    <MobileHeaderLayout
      name={name}
      displayFilter={type === 'list'}
      filterSelectEl={
        <Filter
          values={cacheSearchParams}
          onChange={(data) => {
            setCacheSearchParams({ ...cacheSearchParams, ...data });
          }}
        />
      }
      onReset={searchParamsReset}
      onSubmit={() => {
        searchParamsChange(cacheSearchParams);
      }}
    />
  );
}
