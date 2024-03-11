/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:39:08
 * @FilePath: /u3/apps/u3/src/container/social/Social.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { FeedsType } from '../../components/social/SocialPageNav';

export default function SocialAll() {
  const currentFeedType = useRef<FeedsType>();
  const { feedsType, postScroll, setPostScroll, postsCachedData } =
    useOutletContext<any>(); // TODO: any type

  const trendingCachedData = postsCachedData?.all?.trending;
  const whatsnewCachedData = postsCachedData?.all?.whatsnew;
  const followingCachedData = postsCachedData?.all?.following;

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  return (
    <MainCenter>
      <Outlet
        context={{
          feedsType,
          postScroll,
          setPostScroll,

          trendingCachedData,
          whatsnewCachedData,
          followingCachedData,
        }}
      />
    </MainCenter>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;
