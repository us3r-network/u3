/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-30 16:35:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-30 17:45:50
 * @FilePath: /u3/apps/u3/src/container/news/NewsLayout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import { MEDIA_BREAK_POINTS } from 'src/constants';
import NewsMenu from 'src/components/news/header/NewsMenu';

export default function NewsLayoutContainer() {
  return <NewsLayout />;
}
function NewsLayout() {
  return (
    <Wrapper>
      <HeaderWraper>
        <NewsMenu />
      </HeaderWraper>
      <MainWrapper>
        <Outlet context={{}} />
      </MainWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
export const HeaderWraper = styled.div`
  @media (max-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: 100%;
  }
  @media (min-width: ${MEDIA_BREAK_POINTS.xxxl}px) {
    width: calc(${MEDIA_BREAK_POINTS.xxxl}px - 60px - 40px);
  }
  /* height: 100%; */
  margin: 0 auto;
`;
