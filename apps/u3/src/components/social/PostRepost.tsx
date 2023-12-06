/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 15:05:49
 * @FilePath: /u3/apps/u3/src/components/social/PostReport.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ForwardIcon2 } from '../common/icons/ForwardIcon';

interface PostReportProps {
  totalReposts: number;
  reposted?: boolean;
  reposting?: boolean;
  repostAction?: () => void;
  disabled?: boolean;
}
export default function PostRepost({
  totalReposts,
  reposted,
  reposting,
  repostAction,
  disabled,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReportProps) {
  const [hover, setHover] = useState(false);
  return (
    <PostRepostWrapper
      disabled={disabled}
      reposted={reposted}
      onClick={(e) => {
        if (disabled) return;
        if (repostAction) e.stopPropagation();
        if (!reposting && repostAction) repostAction();
      }}
      onMouseEnter={() => {
        if (disabled) return;
        setHover(true);
      }}
      onMouseLeave={() => {
        if (disabled) return;
        setHover(false);
      }}
      hover={hover}
      {...wrapperProps}
    >
      <span>
        <ForwardIcon2
          stroke={
            hover && !disabled ? '#00b171' : reposted ? '#00B171' : '#718096'
          }
        />
      </span>
      {totalReposts} {reposting ? 'Reposting' : ''}
    </PostRepostWrapper>
  );
}

const PostRepostWrapper = styled.div<{
  hover?: boolean;
  reposted?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: ${(props) => (props.disabled ? '' : 'pointer')};

  color: ${(props) => (props.reposted ? '#00B171' : '#718096')};
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */

  > span {
    height: 20px;
    width: 20px;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${(props) =>
      props.hover ? 'rgba(0, 177, 113, 0.20)' : 'transparent'};
  }

  &:hover {
    ${(props) => !props.disabled && 'color: #00B171;'};
  }
`;
