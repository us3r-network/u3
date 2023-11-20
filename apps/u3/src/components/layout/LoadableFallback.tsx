import styled from 'styled-components';
import Loading from '../common/loading/Loading';

export default function LoadableFallback() {
  return (
    <Wrapper>
      <Loading />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #14171a;
`;
