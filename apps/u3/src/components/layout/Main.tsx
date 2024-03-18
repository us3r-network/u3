/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 15:09:50
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 18:35:10
 * @Description: 站点主体内容（路由导航）
 */
import { useRoutes } from 'react-router-dom';
import { ComponentPropsWithRef, useCallback, useEffect } from 'react';
import { CutomRouteObject, RoutePermission, routes } from '../../route/routes';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import useU3Extension from '../../hooks/shared/useU3Extension';
import {
  selectWebsite,
  setU3ExtensionInstalled,
} from '../../features/shared/websiteSlice';
// import EventCompleteGuideModal from '../news/event/EventCompleteGuideModal';
import useLogin from '../../hooks/shared/useLogin';
import NoLogin from './NoLogin';
import { cn } from '@/lib/utils';

export default function Main(props: ComponentPropsWithRef<'div'>) {
  const dispatch = useAppDispatch();
  const { isLogin, isAdmin } = useLogin();
  // const { openEventCompleteGuideModal, eventCompleteGuideEndCallback } =
  //   useAppSelector(selectWebsite);
  const { u3ExtensionInstalled } = useU3Extension();
  useEffect(() => {
    dispatch(setU3ExtensionInstalled(u3ExtensionInstalled));
  }, [u3ExtensionInstalled]);

  const renderElement = useCallback(
    ({ element, permissions }: CutomRouteObject) => {
      if (permissions) {
        // 需要以登录为前提的权限
        if (isLogin) {
          // 验证admin权限
          if (permissions.includes(RoutePermission.admin)) {
            if (isAdmin) {
              return element;
            }
            return <NoAdminPermission />;
          }
          return element;
        }
        // 没有登录但需要登录权限
        if (permissions.includes(RoutePermission.login)) {
          return <NoLogin />;
        }
      }
      return element;
    },
    [isLogin, isAdmin]
  );
  const routesMap = routes.map((item) => ({
    ...item,
    element: renderElement(item),
  }));
  const renderRoutes = useRoutes(routesMap);

  return (
    <div className={cn('w-full h-full relative')} {...props}>
      {renderRoutes}
      {/* <EventCompleteGuideModal
        isOpen={openEventCompleteGuideModal}
        onGuideEnd={eventCompleteGuideEndCallback}
      /> */}
    </div>
  );
}

function NoAdminPermission() {
  return (
    <div className={cn('w-full h-full flex justify-center items-center')}>
      <div className={cn('text-white text-2xl')}>Need Admin Permission</div>
    </div>
  );
}
