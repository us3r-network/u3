import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { FeedsType } from '../../components/social/SocialPageNav';
import AddPostForm from '../../components/social/AddPostForm';
import { AddPostFormWrapper } from './CommonStyles';

export default function SocialAll() {
  const currentFeedType = useRef<FeedsType>();
  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>(); // TODO: any type

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  return (
    <MainCenter>
      <AddPostFormWrapper>
        <AddPostForm />
      </AddPostFormWrapper>
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
