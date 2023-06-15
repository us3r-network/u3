import styled from 'styled-components';
import { MainWrapper } from '../components/layout/Index';

function NoMatchRoute() {
  return <Wrapper>404</Wrapper>;
}
export default NoMatchRoute;
const Wrapper = styled(MainWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: bold;
  color: #718096;
  font-style: italic;
`;
