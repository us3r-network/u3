/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-13 19:08:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 20:44:43
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import { CutomRouteObject, NoMatchRoute, RouteKey, routes } from './routes';

type MatchRouteMeta = {
  firstRouteMeta: CutomRouteObject;
  lastRouteMeta: CutomRouteObject;
  matchRoutesMeta: Array<CutomRouteObject>;
};
const defaultMatchRouteMeta = {
  firstRouteMeta: NoMatchRoute,
  lastRouteMeta: NoMatchRoute,
  matchRoutesMeta: [],
};
function useRoute() {
  const location = useLocation();
  const [matchRouteMeta, setMatchRouteMeta] = useState<MatchRouteMeta>(
    defaultMatchRouteMeta
  );
  useEffect(() => {
    const routesMeta = matchRoutes(routes, location);

    if (!routesMeta) {
      setMatchRouteMeta(defaultMatchRouteMeta);
    } else {
      setMatchRouteMeta({
        firstRouteMeta: routesMeta[0].route as CutomRouteObject,
        lastRouteMeta: routesMeta[routesMeta.length - 1]
          .route as CutomRouteObject,
        matchRoutesMeta: routesMeta.map(
          (item) => item.route as CutomRouteObject
        ),
      });
    }
  }, [location]);
  const findRouteMeta = useCallback(
    (key: RouteKey) =>
      matchRouteMeta.matchRoutesMeta.find((item) => item.key === key),
    [matchRouteMeta]
  );
  return { ...matchRouteMeta, findRouteMeta };
}

export default useRoute;
