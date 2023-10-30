/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/button-has-type */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 09:54:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-30 16:00:35
 * @Description: 文本超出显示展开箭头
 */
import { useEffect, useRef, useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useWindowSize from '../../../hooks/shared/useWindowSize';

type Props = StyledComponentPropsWithRef<'div'> & {
  row: number;
};
export default function EllipsisTextExpandMore({
  children,
  row,
  ...otherProps
}: Props) {
  const [displayMore, setDisplayMore] = useState(false);
  const textRef = useRef<HTMLDivElement>();
  const [width] = useWindowSize();
  useEffect(() => {
    if (textRef.current.scrollHeight > textRef.current.clientHeight) {
      setDisplayMore(true);
    } else {
      setDisplayMore(false);
    }
  }, [width]);
  return (
    <EllipsisTextExpandMoreWrapper {...otherProps} row={row}>
      <input id="more-check" className="more" type="checkbox" />
      <div
        className="text"
        ref={(el) => {
          if (el) {
            textRef.current = el;
          }
        }}
      >
        {displayMore && <label className="more-btn" htmlFor="more-check" />}
        {children}
      </div>
    </EllipsisTextExpandMoreWrapper>
  );
}

const EllipsisTextExpandMoreWrapper = styled.div<{ row?: number }>`
  display: flex;
  .text {
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: justify;
    display: -webkit-box;
    -webkit-line-clamp: ${({ row }) => row ?? 1};
    -webkit-box-orient: vertical;
    position: relative;
  }
  .text::before {
    content: '';
    height: calc(100% - 15px);
    float: right;
  }
  .more-btn {
    float: right;
    clear: both;
    margin-left: 10px;
    cursor: pointer;
  }
  .more-btn::before {
    content: '﹀';
  }
  .more {
    display: none;
  }
  .more:checked + .text {
    -webkit-line-clamp: 999;
  }
  .more:checked + .text::after {
    visibility: hidden;
  }
  .more:checked + .text .more-btn::before {
    content: '︿';
  }
`;
