/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-28 21:54:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:31:29
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlQuery = useMemo(
    () => ({
      types: searchParams.get('types') || '',
      chains: searchParams.get('chains') || '',
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );

  const currentSearchParams = useMemo(
    () => ({
      types: currentUrlQuery.types.split(',').filter((item) => !!item),
      chains: currentUrlQuery.chains.split(',').filter((item) => !!item),
      keywords: currentUrlQuery.keywords,
    }),
    [currentUrlQuery.types, currentUrlQuery.chains, currentUrlQuery.keywords]
  );
  const searchParamsChange = useCallback(
    (values: { types?: string[]; chains?: string[]; keywords?: string }) => {
      const newUrlQuery = { ...currentUrlQuery };
      // eslint-disable-next-line guard-for-in
      for (const key in values) {
        switch (key) {
          case 'types':
          case 'chains':
            newUrlQuery[key] = values[key].join(',');
            break;
          default:
            newUrlQuery[key] = values[key];
            break;
        }
      }
      setSearchParams(newUrlQuery as unknown as URLSearchParamsInit);
    },
    [currentUrlQuery]
  );
  const searchParamsReset = useCallback(() => {
    setSearchParams({});
  }, []);
  return {
    currentSearchParams,
    searchParamsChange,
    searchParamsReset,
  };
};
