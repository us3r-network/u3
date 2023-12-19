import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import Title from '../Title';
import DappCard, { DappData } from './DappCard';
import Loading from '../../common/loading/Loading';
import { MEDIA_BREAK_POINTS } from '../../../constants';

export type HighScoreDappsData = Array<DappData & { id: number }>;

export default function HighScoreDapps({
  dapps,
  isLoading,
}: {
  dapps: HighScoreDappsData;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Title
        text="👍 Highly Rated Dapps"
        viewAllAction={() => {
          navigate(`/dapp-store`);
        }}
      />
      <CardsWrapper>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <CardsLayout>
            {dapps.map((item) => {
              return (
                <DappCard
                  key={item.id}
                  data={item}
                  onClick={() => navigate(`/dapp-store/${item.id}`)}
                />
              );
            })}
          </CardsLayout>
        )}
      </CardsWrapper>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
`;
const CardsWrapper = styled.div`
  width: 100%;
  margin-top: 20px;
  ${isMobile &&
  `
    margin-top: 10px;

  `}
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${isMobile &&
  `
    height: 430px;
  `}
`;
const CardsLayout = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, minmax(calc((100% - 20px * 3) / 4), 1fr));

  @media (min-width: ${MEDIA_BREAK_POINTS.md}px) and (max-width: ${MEDIA_BREAK_POINTS.xxl}px) {
    grid-template-columns: repeat(3, minmax(calc((100% - 20px * 1) / 2), 1fr));
  }

  @media (max-width: ${MEDIA_BREAK_POINTS.md}px) {
    grid-template-columns: repeat(1);
  }
  ${isMobile &&
  `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `}
`;
