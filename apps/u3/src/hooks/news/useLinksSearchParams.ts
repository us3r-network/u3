/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-28 21:54:50
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-13 17:01:04
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { defaultLinkOrderBy } from '../../components/news/links/LinkOrderBySelect';

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlQuery = useMemo(
    () => ({
      orderBy: searchParams.get('orderBy') || defaultLinkOrderBy,
      channels: searchParams.get('channels') || '',
      includeDomains: searchParams.get('includeDomains') || '',
      excludeDomains: searchParams.get('excludeDomains') || '',
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );

  const currentSearchParams = useMemo(
    () => ({
      orderBy: currentUrlQuery.orderBy,
      channels: currentUrlQuery.channels.split(',').filter((item) => !!item),
      includeDomains: currentUrlQuery.includeDomains
        .split(',')
        .filter((item) => !!item),
      excludeDomains: currentUrlQuery.excludeDomains
        .split(',')
        .filter((item) => !!item),
      keywords: currentUrlQuery.keywords,
    }),
    [currentUrlQuery]
  );
  const searchParamsChange = useCallback(
    (values: {
      orderBy?: any;
      channels?: string[];
      includeDomains?: string[];
      excludeDomains?: string[];
      keywords?: string;
    }) => {
      const newUrlQuery = { ...currentUrlQuery };
      // eslint-disable-next-line guard-for-in
      for (const key in values) {
        switch (key) {
          case 'channels':
          case 'includeDomains':
          case 'excludeDomains':
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
