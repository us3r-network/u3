import styled from 'styled-components';
import DappCard, { DappData } from './DappCard';

export type HighScoreDappsData = Array<DappData & { id: number }>;
export type HighScoreDappsProps = {
  dapps: HighScoreDappsData;
};
export default function HighScoreDapps({ dapps }: HighScoreDappsProps) {
  return (
    <Wrapper>
      <Title>Which Dapps are Popular?</Title>
      <CardsWrapper>
        {dapps.map((item) => {
          return <DappCard key={item.id} data={item} />;
        })}
      </CardsWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const Title = styled.h1`
  margin: 0px;
  padding: 0px;
  color: var(--14171-a, #14171a);
  font-family: Marion;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const CardsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;
