/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 11:40:24
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-24 13:38:09
 * @Description: file description
 */
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
// import usePersonalFavorsLinkData from './usePersonalFavorsLinkData';

// import { RouteKey } from '../route/routes';
// import useRoute from '../route/useRoute';

const DAPP_MODAL_SEARCH_KEY_ID = 'dappId';
const DAPP_MODAL_SEARCH_KEY_TOKENID = 'dappTokenId';
export default () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // 是否是dapp相关路由
  // const { firstRouteMeta } = useRoute();
  // const isDappRoute = useMemo(() => {
  //   return [RouteKey.dappStore, RouteKey.dapp].includes(firstRouteMeta.key);
  // }, [firstRouteMeta]);
  // 当前的dapp信息
  const dappId = useMemo(() => {
    const id = searchParams.get(DAPP_MODAL_SEARCH_KEY_ID);
    if (id) {
      return { id };
    }
    const tokenId = Number(searchParams.get(DAPP_MODAL_SEARCH_KEY_TOKENID));
    if (tokenId) {
      return { tokenId };
    }
    return null;
  }, [searchParams]);

  // 是否打开dapp modal
  const isOpenDappModal = useMemo(() => {
    return !!dappId;
  }, [dappId]);
  // 执行打开dapp modal
  const openDappModal = useCallback(
    (id: string | number) => {
      searchParams.set(DAPP_MODAL_SEARCH_KEY_ID, String(id));
      setSearchParams(searchParams.toString());
    },
    [searchParams, setSearchParams]
  );
  const openDappModalByToken = useCallback(
    (tokenId: number) => {
      searchParams.set(DAPP_MODAL_SEARCH_KEY_TOKENID, String(tokenId));
      setSearchParams(searchParams.toString());
    },
    [searchParams, setSearchParams]
  );
  // 执行关闭dapp modal
  const closeDappModal = useCallback(() => {
    searchParams.delete(DAPP_MODAL_SEARCH_KEY_ID);
    searchParams.delete(DAPP_MODAL_SEARCH_KEY_TOKENID);
    setSearchParams(searchParams.toString());
  }, [searchParams, setSearchParams]);

  return {
    isOpenDappModal,
    dappId,
    openDappModal,
    openDappModalByToken,
    closeDappModal,
  };
};
