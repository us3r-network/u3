import styled from 'styled-components';
import ButtonBase from '../common/button/ButtonBase';

export const PostDetailWrapper = styled.div<{ isMobile?: boolean }>`
  border-radius: 20px;
  background: #212228;
  border: 1px solid #39424c;
  overflow: hidden;
  width: 100%;
`;
export const PostDetailCommentsWrapper = styled.div`
  & > * {
    border-top: 1px solid #39424c;
  }
`;

export const LoadMoreBtn = styled(ButtonBase)`
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background: #212228;
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
