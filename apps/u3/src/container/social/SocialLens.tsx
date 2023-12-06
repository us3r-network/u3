/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:37:34
 * @FilePath: /u3/apps/u3/src/container/social/SocialLens.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useRef } from 'react';
import { Outlet, useOutletContext, useSearchParams } from 'react-router-dom';

import FollowingDefault from 'src/components/social/FollowingDefault';
import { FeedsType } from 'src/components/social/SocialPageNav';
import useLogin from 'src/hooks/shared/useLogin';
import { LensListBox, MainCenter, NoLoginStyled } from './CommonStyles';
import { useLensCtx } from '../../contexts/social/AppLensCtx';

export default function SocialFarcaster() {
  const { isLogin } = useLogin();
  const currentFeedType = useRef<FeedsType>();
  // const [searchParams] = useSearchParams();
  // const currentSearchParams = useMemo(
  //   () => ({
  //     keyword: searchParams.get('keyword') || '',
  //   }),
  //   [searchParams]
  // );

  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>(); // TODO: any

  const { sessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = sessionProfile || {};

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  if (feedsType === FeedsType.FOLLOWING) {
    if (!isLogin) {
      return <NoLoginStyled />;
    }
    if (!lensSessionProfileId) {
      return (
        <MainCenter>
          <FollowingDefault lens />
        </MainCenter>
      );
    }
  }

  return (
    <LensListBox>
      <Outlet
        context={{
          postScroll,
          setPostScroll,
          feedsType,
        }}
      />
    </LensListBox>
  );
}
