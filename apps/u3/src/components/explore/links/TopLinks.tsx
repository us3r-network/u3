/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 15:43:39
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-01 16:25:46
 * @FilePath: /u3/apps/u3/src/components/explore/links/TopLinks.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import CardBase from '../../common/card/CardBase';
import Title from '../Title';
import LinkCard from './LinkCard';
import Loading from '../../common/loading/Loading';
import { encodeLinkURL } from '../../../utils/news/link';

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
          navigate(`/news/links/all`);
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
                    navigate(`/news/links/all/${encodeLinkURL(item?.url)}`)
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
  &:not(:first-child) {
    border-top: 1px solid rgba(57, 66, 76, 0.5);
  }
`;
