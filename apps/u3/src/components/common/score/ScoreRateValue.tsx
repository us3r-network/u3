import styled, { StyledComponentPropsWithRef } from 'styled-components';
import ScoreRate from './ScoreRate';

type Props = StyledComponentPropsWithRef<'div'> & {
  value?: number;
  count?: number;
};
export default function ScoreRateValue({
  value = 0,
  count = 5,
  ...otherProps
}: Props) {
  return (
    <Wrapper {...otherProps}>
      <ScoreRate value={value} count={count} />
      <Value>{value}</Value>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const Value = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 21px;
  text-align: center;

  color: #cf9523;
`;
