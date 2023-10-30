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
export default function PostReport({
  totalReposts,
  reposted,
  reposting,
  repostAction,
  disabled,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReportProps) {
  const [hover, setHover] = useState(false);
  return (
    <PostReportWrapper
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
      {totalReposts} {reposting ? 'Reposting' : 'Reposts'}
    </PostReportWrapper>
  );
}

const PostReportWrapper = styled.div<{
  hover?: boolean;
  reposted?: boolean;
  disabled?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

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
