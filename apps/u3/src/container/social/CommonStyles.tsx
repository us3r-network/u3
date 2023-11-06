import NoLogin from 'src/components/layout/NoLogin';
import styled from 'styled-components';

export const MainCenter = styled.div`
  width: 100%;
`;

export const NoLoginStyled = styled(NoLogin)`
  height: calc(100vh - 136px);
  padding: 0;
`;

export const FarcasterListBox = styled.div``;
export const LensListBox = styled.div``;

export const AddPostFormWrapper = styled.div`
  background: #212228;
  border-radius: 20px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
`;

export const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;

  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  background: #212228;
  overflow: hidden;
  & > * {
    border-top: 1px solid #718096;
  }
`;

export const LoadingWrapper = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoadingMoreWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;
