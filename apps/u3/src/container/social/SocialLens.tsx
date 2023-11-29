import { useEffect, useRef } from 'react';
import { Outlet, useOutletContext, useSearchParams } from 'react-router-dom';

import AddPostForm from 'src/components/social/AddPostForm';
import FollowingDefault from 'src/components/social/FollowingDefault';
import { FeedsType } from 'src/components/social/SocialPageNav';
import useLogin from 'src/hooks/shared/useLogin';
import {
  AddPostFormWrapper,
  LensListBox,
  MainCenter,
  NoLoginStyled,
} from './CommonStyles';
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
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>

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
