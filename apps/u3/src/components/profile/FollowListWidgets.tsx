import styled from 'styled-components';

export const FollowListWrapper = styled.div`
  width: 100%;
`;

export const FollowList = styled.div`
  overflow: hidden;
  & > * {
    border-bottom: 1px solid #39424c;
  }
  & > *:last-child {
    border-bottom: none;
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
