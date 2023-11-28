import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function useListScroll(parentId: string) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [firstLoadingDone, setFirstLoadingDone] = useState(false);

  const { postScroll, setPostScroll } = useOutletContext<any>();

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
