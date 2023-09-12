import styled from 'styled-components';
import ButtonBase from '../common/button/ButtonBase';

export const PostDetailWrapper = styled.div<{ isMobile?: boolean }>`
  border-radius: 20px;
  background: #212228;
  overflow: hidden;
  width: ${(props) => (props.isMobile ? '100%' : '600px')};
`;
export const PostDetailCommentsWrapper = styled.div`
  & > * {
    border-top: 1px solid #718096;
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
