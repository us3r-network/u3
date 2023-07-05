/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-28 21:54:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 17:58:45
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import { URLSearchParamsInit, useSearchParams } from 'react-router-dom';
import { defaultContentOrderBy } from '../components/contents/ContentOrderBySelect';

export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlQuery = useMemo(
    () => ({
      orderBy: searchParams.get('orderBy') || defaultContentOrderBy,
      tags: searchParams.get('tags') || '',
      lang: searchParams.get('lang') || '',
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );

  const currentSearchParams = useMemo(
    () => ({
      orderBy: currentUrlQuery.orderBy,
      tags: currentUrlQuery.tags.split(',').filter((item) => !!item),
      lang: currentUrlQuery.lang.split(',').filter((item) => !!item),
      keywords: currentUrlQuery.keywords,
    }),
    [
      currentUrlQuery.orderBy,
      currentUrlQuery.tags,
      currentUrlQuery.lang,
      currentUrlQuery.keywords,
    ]
  );
  const searchParamsChange = useCallback(
    (values: {
      orderBy?: any;
      tags?: string[];
      lang?: string[];
      keywords?: string;
    }) => {
      const newUrlQuery = { ...currentUrlQuery };
      // eslint-disable-next-line guard-for-in
      for (const key in values) {
        switch (key) {
          case 'tags':
          case 'lang':
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
      orderBy: defaultContentOrderBy,
    });
  }, []);
  return {
    currentSearchParams,
    searchParamsChange,
    searchParamsReset,
  };
};
