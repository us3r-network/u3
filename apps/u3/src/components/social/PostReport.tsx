import { useState } from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import ForwardIcon from '../icons/ForwardIcon';

interface PostReportProps {
  totalReposts: number;
  reposted?: boolean;
  reposting?: boolean;
  repostAction?: () => void;
}
export default function PostReport({
  totalReposts,
  reposted,
  reposting,
  repostAction,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReportProps) {
  const [hover, setHover] = useState(false);
  return (
    <PostReportWrapper
      onClick={(e) => {
        if (repostAction) e.stopPropagation();
        if (!reposting && repostAction) repostAction();
      }}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      hover={hover}
      {...wrapperProps}
    >
      <span>
        <ForwardIcon
          stroke={hover ? '#00b171' : reposted ? '#9C9C9C' : 'white'}
        />
      </span>
      {totalReposts} {reposting ? 'Reposting' : 'Reposts'}
    </PostReportWrapper>
  );
}

const PostReportWrapper = styled.div<{ hover?: boolean }>`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;

  color: #718096;
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
    color: #00b171;
  }
`;
