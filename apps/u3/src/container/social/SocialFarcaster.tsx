import styled from 'styled-components';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useEffect, useRef } from 'react';

import AddPostForm from 'src/components/social/AddPostForm';
import { FeedsType } from 'src/components/social/SocialPageNav';

export default function SocialFarcaster() {
  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>(); // TODO: any

  const currentFeedType = useRef<FeedsType>();

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  return (
    <FarcasterListBox>
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
    </FarcasterListBox>
  );
}

const FarcasterListBox = styled.div``;

const AddPostFormWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;
