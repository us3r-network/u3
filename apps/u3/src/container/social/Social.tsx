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

import { useFarcasterCtx } from '../../contexts/social/FarcasterCtx';
import { FeedsType } from '../../components/social/SocialPageNav';

import FollowingDefault from '../../components/social/FollowingDefault';
import useLogin from '../../hooks/shared/useLogin';
import { NoLoginStyled } from './CommonStyles';
import { useLensCtx } from '../../contexts/social/AppLensCtx';

export default function SocialAll() {
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const currentFeedType = useRef<FeedsType>();
  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>(); // TODO: any type

  const { isConnected: isConnectedFarcaster } = useFarcasterCtx();

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!isConnectedFarcaster && !lensSessionProfileId) {
      return (
        <MainCenter>
          <FollowingDefault farcaster lens />
        </MainCenter>
      );
    }
  }

  return (
    <MainCenter>
      <Outlet
        context={{
          feedsType,
          postScroll,
          setPostScroll,
        }}
      />
    </MainCenter>
  );
}

const MainCenter = styled.div`
  width: 100%;
`;
