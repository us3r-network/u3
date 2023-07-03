/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-30 18:50:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-01 20:12:57
 * @Description: file description
 */
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

function ListRouteLayout({ children }: PropsWithChildren) {
  return (
    <ListRouteLayoutWrapper>
      <ListBox>{children}</ListBox>
      <RouteOutLetBox>
        <Outlet />
      </RouteOutLetBox>
    </ListRouteLayoutWrapper>
  );
}
export default ListRouteLayout;
const ListRouteLayoutWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
`;
const ListBox = styled.div`
  width: 400px;
`;
const RouteOutLetBox = styled.div`
  flex: 1;
`;
