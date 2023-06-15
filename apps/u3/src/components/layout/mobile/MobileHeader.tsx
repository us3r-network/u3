/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import useRoute from '../../../route/useRoute';
import { RouteKey } from '../../../route/routes';
import MobileHomeHeader from './MobileHomeHeader';
import MobileSubPageHeader from './MobileSubPageHeader';
import { capitalizeFirstLetter } from '../../../utils/string';
// import MobileDappHeader from './MobileDappHeader';
// import MobileContentHeader from './MobileContentHeader';

export default function MobileHeader() {
  const { firstRouteMeta } = useRoute();

  // if ([RouteKey.contents, RouteKey.content].includes(firstRouteMeta.key)) {
  //   const type = firstRouteMeta.key === RouteKey.contents ? 'list' : 'detail';
  //   return <MobileContentHeader type={type} />;
  // }

  if ([RouteKey.dapp, RouteKey.profile].includes(firstRouteMeta.key)) {
    return (
      <MobileSubPageHeader name={capitalizeFirstLetter(firstRouteMeta?.key)} />
    );
  }

  return <MobileHomeHeader />;
}
