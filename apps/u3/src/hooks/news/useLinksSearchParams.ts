/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-28 21:54:50
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-01 14:46:44
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { defaultLinkOrderBy } from '../../components/news/links/LinkOrderBySelect';

export const defaultLinkSearchParams = {
  orderBy: defaultLinkOrderBy,
  keywords: '',
};
export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlQuery = useMemo(
    () => ({
      orderBy: searchParams.get('orderBy') || defaultLinkOrderBy,
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );

  const currentSearchParams = useMemo(
    () => ({
      orderBy: currentUrlQuery.orderBy,
      keywords: currentUrlQuery.keywords,
    }),
    [currentUrlQuery]
  );
  const searchParamsChange = useCallback(
    (values: { orderBy?: any; keywords?: string }) => {
      const newUrlQuery = { ...currentUrlQuery };
      // eslint-disable-next-line guard-for-in
      for (const key in values) {
        newUrlQuery[key] = values[key];
      }
      setSearchParams(newUrlQuery as unknown as URLSearchParamsInit);
    },
    [currentUrlQuery]
  );
  const searchParamsReset = useCallback(() => {
    setSearchParams({
      orderBy: defaultLinkOrderBy,
    });
  }, []);
  return {
    currentSearchParams,
    searchParamsChange,
    searchParamsReset,
  };
};
