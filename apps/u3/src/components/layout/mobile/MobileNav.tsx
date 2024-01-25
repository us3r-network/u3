/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-22 16:03:33
 * @Description: file description
 */
import styled from 'styled-components';

import useRoute from '../../../route/useRoute';
import { RouteKey } from '../../../route/routes';
import Nav from '../Nav';

export default function MobileNav() {
  const { firstRouteMeta } = useRoute();

  if ([RouteKey.dapp, RouteKey.profile].includes(firstRouteMeta.key)) {
    return null;
  }

  return (
    <MobileNavWrapper>
      <Nav />
    </MobileNavWrapper>
  );
}

const MobileNavWrapper = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 2;
  background: #1b1e23;
  border-top: 1px solid #39424c;
  & > div {
    flex-direction: row;
    & > div {
      flex: 1;
      height: 60px;
      align-items: center;
      justify-content: center;
      background: transparent !important;
    }
  }
`;
