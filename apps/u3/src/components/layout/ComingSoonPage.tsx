import styled from 'styled-components';
import { MainWrapper } from './Index';

function ComingSoonPage() {
  return <Wrapper>Coming Soon</Wrapper>;
}
export default ComingSoonPage;
const Wrapper = styled(MainWrapper)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  font-weight: bold;
  color: #718096;
  font-style: italic;
`;
