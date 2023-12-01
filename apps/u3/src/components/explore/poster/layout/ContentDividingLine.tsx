import styled from 'styled-components';

export default function ContentDividingLine() {
  return (
    <Wrapper>
      <Line />
      <Line />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;
const Line = styled.span`
  display: inline-block;
  width: 100%;
  height: 4px;
  background: #000;
`;
