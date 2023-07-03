/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:32:58
 * @Description: file description
 */
import useRoute from '../../../route/useRoute';
import MobileHomeHeader from './MobileHomeHeader';

export default function MobileHeader() {
  const { firstRouteMeta } = useRoute();

  return <MobileHomeHeader />;
}
