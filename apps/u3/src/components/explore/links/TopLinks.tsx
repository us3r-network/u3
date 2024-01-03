/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 15:43:39
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-07 15:20:01
 * @FilePath: /u3/apps/u3/src/components/explore/links/TopLinks.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import CardBase from '../../common/card/CardBase';
import Title from '../Title';
import LinkCard from './LinkCard';
import Loading from '../../common/loading/Loading';
import { encodeLinkURL } from '../../../utils/news/link';

const ROUTE_PREFIX = '/b/links';
export type TopLinksData = Array<{ logo: string; title: string; url: string }>;

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
        text="👍 App Feeds"
        viewAllAction={() => {
          navigate(`${ROUTE_PREFIX}/all`);
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
                    isMobile
                      ? window.open(item?.url, '_blank')
                      : navigate(
                          `${ROUTE_PREFIX}/all/${encodeLinkURL(item?.url)}`
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
  ${isMobile &&
  `
    height: auto;
    border: none;
    margin-top: 10px;
    background: none;
    overflow: visible;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  ${isMobile &&
  `
    height: auto;
    gap: 10px;
  `}
`;
const LinkCardItem = styled(LinkCard)`
  height: 0;
  flex: 1;
  ${!isMobile &&
  `
    &:not(:first-child) {
      border-top: 1px solid rgba(57, 66, 76, 0.5);
    }
    `}

  ${isMobile &&
  `
    height: 68px;
    flex: none;
    border: 1px solid #39424C;
    border-radius: 10px;
    box-sizing: border-box;
  `}
`;
