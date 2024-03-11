import styled from 'styled-components';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { FeedsType } from 'src/components/social/SocialPageNav';

export default function SocialFarcaster() {
  const { feedsType, postScroll, setPostScroll, postsCachedData } =
    useOutletContext<any>(); // TODO: any

  const currentFeedType = useRef<FeedsType>();
  const trendingCachedData = postsCachedData?.fc?.trending;
  const whatsnewCachedData = postsCachedData?.fc?.whatsnew;
  const followingCachedData = postsCachedData?.fc?.following;

  useEffect(() => {
    if (feedsType === currentFeedType.current) return;
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  return (
    <FarcasterListBox>
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
    </FarcasterListBox>
  );
}

const FarcasterListBox = styled.div``;
