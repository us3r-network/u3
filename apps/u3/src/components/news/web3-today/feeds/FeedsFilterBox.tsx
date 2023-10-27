/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 18:59:57
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useCallback, useEffect, useRef } from 'react';
import useWindowSize from '../../../../hooks/shared/useWindowSize';

type FeedsFilterBoxProps = StyledComponentPropsWithRef<'div'> & {
  open?: boolean;
};
export default function FeedsFilterBox({
  children,
  open,
  ...otherProps
}: FeedsFilterBoxProps) {
  const bottomInnerRef = useRef<HTMLDivElement>();
  const [width] = useWindowSize();
  const setOpenStyle = useCallback(() => {
    if (bottomInnerRef.current) {
      bottomInnerRef.current.parentElement.style.height = `${bottomInnerRef.current.offsetHeight}px`;
      bottomInnerRef.current.parentElement.style.paddingTop = '20px';
      bottomInnerRef.current.parentElement.style.opacity = '1';
    }
  }, []);
  const setCloseStyle = useCallback(() => {
    if (bottomInnerRef.current) {
      bottomInnerRef.current.parentElement.style.height = '0px';
      bottomInnerRef.current.parentElement.style.paddingTop = '0px';
      bottomInnerRef.current.parentElement.style.opacity = '0';
    }
  }, []);
  const isListenWindowSize = useRef(false);
  useEffect(() => {
    if (isListenWindowSize.current) {
      setOpenStyle();
    }
  }, [width]);
  return (
    <FeedsFilterBoxWrapper {...otherProps}>
      <FeedsFilterBoxInner
        ref={(el) => {
          if (el) {
            bottomInnerRef.current = el;
            if (open) {
              setOpenStyle();
              isListenWindowSize.current = true;
            } else {
              setCloseStyle();
              isListenWindowSize.current = false;
            }
          }
        }}
      >
        {children}
      </FeedsFilterBoxInner>
    </FeedsFilterBoxWrapper>
  );
}
const FeedsFilterBoxWrapper = styled.div`
  padding-top: 20px;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease-out;
`;
const FeedsFilterBoxInner = styled.div`
  width: 100%;
  max-height: 50vh;
  overflow-y: auto;
`;
