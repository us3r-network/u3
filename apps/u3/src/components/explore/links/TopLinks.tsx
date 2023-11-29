import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CardBase from '../../common/card/CardBase';
import Title from '../Title';
import LinkCard from './LinkCard';
import Loading from '../../common/loading/Loading';

export type TopLinksData = Array<{ logo: string; name: string; url: string }>;

export default function TopLinks({
  links,
  isLoading,
}: {
  links: TopLinksData;
  isLoading: boolean;
}) {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Title
        text="👍 Top Links"
        viewAllAction={() => {
          navigate(`/links`);
        }}
      />
      <CardsWrapper>
        {isLoading ? (
          <LoadingWrapper>
            <Loading />
          </LoadingWrapper>
        ) : (
          <CardsLayout>
            {links.map((item) => {
              return (
                <LinkCardItem
                  key={item.url}
                  data={item}
                  onClick={() =>
                    navigate(
                      `/links/${Buffer.from(item?.url, 'utf8').toString(
                        'base64'
                      )}`
                    )
                  }
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
const CardsWrapper = styled(CardBase)`
  width: 100%;
  height: 534px;
  margin-top: 20px;
  padding: 0;
`;
const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CardsLayout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const LinkCardItem = styled(LinkCard)`
  height: 0;
  flex: 1;
  // css设置除了第一个子元素，其它都加个border-top
  &:not(:first-child) {
    border-top: 1px solid rgba(57, 66, 76, 0.5);
  }
`;
