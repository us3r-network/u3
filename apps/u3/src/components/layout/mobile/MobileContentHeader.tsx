/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 22:25:02
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import useContentsSearchParams from '../../../hooks/news/useContentsSearchParams';
import Filter from '../../news/contents/Filter';
import MobileHeaderLayout from './MobileHeaderLayout';

export default function MobileContentHeader({
  type,
}: {
  type: 'list' | 'detail';
}) {
  const name = type === 'detail' ? 'Content Detail' : 'Content';
  const { currentSearchParams, searchParamsChange, searchParamsReset } =
    useContentsSearchParams();
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
          filterAction={(data) => {
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
