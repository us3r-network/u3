import { useEffect, useRef, useState } from 'react';

export default function useInfoCalc(
  targetRef: React.MutableRefObject<HTMLDivElement>,
  withOffset?: boolean
) {
  const [infoShow, setInfoShow] = useState(false);
  const [infoShowVisible, setInfoShowVisible] = useState(false);
  const [infoTop, setInfoTop] = useState(0);
  const [infoLeft, setInfoLeft] = useState(0);

  const timerRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    const profileWrapper = document.getElementById('profile-wrapper');
    const profileContentBox = document.getElementById('profile-content-box');
    const card = targetRef.current;
    function mouseMoveHandler(e: MouseEvent) {
      const { clientX } = e;
      const { clientWidth: profileWidth } = profileContentBox;
      const profileWrapperOffset = getOffset(profileWrapper);
      const isLeft =
        profileWidth / 2 > clientX - profileWrapperOffset.left - 30;
      const { clientHeight, clientWidth } = targetRef.current;
      const offset = getOffset(targetRef.current);

      setInfoShow(true);
      setInfoTop(offset.top + (clientHeight / 4) * 3);
      if (isLeft) {
        if (withOffset) {
          setInfoLeft(offset.left + clientWidth / 15);
        } else {
          setInfoLeft(offset.left);
        }
      } else if (withOffset) {
        setInfoLeft(offset.left - 340 + (clientWidth * 14) / 15);
      } else {
        setInfoLeft(offset.left - 340 + clientWidth);
      }
    }
    function mouseLeaveHandler() {
      setInfoShow(false);
    }

    card.addEventListener('mousemove', mouseMoveHandler);
    card.addEventListener('mouseout', mouseLeaveHandler);
    profileWrapper.addEventListener('scroll', mouseLeaveHandler);
    return () => {
      card.removeEventListener('mousemove', mouseMoveHandler);
      card.removeEventListener('mouseout', mouseLeaveHandler);
      profileWrapper.removeEventListener('scroll', mouseLeaveHandler);
    };
  }, []);
  useEffect(() => {
    if (infoShow) {
      timerRef.current = setTimeout(() => {
        setInfoShowVisible(true);
      }, 100);
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = undefined;
      }
      setInfoShowVisible(false);
    }
  }, [infoShow]);

  return {
    infoShow,
    infoShowVisible,
    infoTop,
    infoLeft,
  };
}

function getOffset(element: HTMLElement) {
  if (!element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  const rect = element.getBoundingClientRect();
  const win = element.ownerDocument.defaultView;
  return {
    top: rect.top + win.pageYOffset,
    left: rect.left + win.pageXOffset,
  };
}
