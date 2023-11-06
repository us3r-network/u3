import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FeedsType } from 'src/components/social/SocialPageNav';

export default function useListScroll(parentId: string) {
  const currentFeedType = useRef<FeedsType>();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [firstLoadingDone, setFirstLoadingDone] = useState(false);

  const { feedsType, postScroll, setPostScroll } = useOutletContext<any>();

  useEffect(() => {
    if (!currentFeedType.current) {
      currentFeedType.current = feedsType;
      return;
    }
    if (feedsType === currentFeedType.current) return;
    setFirstLoadingDone(false);
    document.getElementById('social-scroll-wrapper')?.scrollTo(0, 0);
    currentFeedType.current = feedsType;
  }, [feedsType]);

  useEffect(() => {
    setMounted(true);
    setPostScroll({
      currentParent: parentId,
      id: '',
      top: 0,
    });
  }, [parentId]);

  useEffect(() => {
    if (postScroll.currentParent !== parentId) return;
    const focusPost = document.getElementById(postScroll.id);
    focusPost?.scrollIntoView({
      behavior: 'instant',
      block: 'center',
      inline: 'center',
    });
    setScrolled(true);
  }, [postScroll, parentId]);

  return {
    scrolled,
    mounted,
    firstLoadingDone,
    setFirstLoadingDone,
  };
}
