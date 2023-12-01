import styled from 'styled-components';
import LinkCard from './LinkCard';
import ContentDividingLine from '../ContentDividingLine';
import qrCodeU3 from '../../../../common/assets/imgs/qrcode_u3.xyz.png';

export type TopLinksData = Array<{ logo: string; name: string; url: string }>;
export type TopLinksProps = { links: TopLinksData };

export default function TopLinks({ links }: TopLinksProps) {
  return (
    <Wrapper>
      <HorizontalLine />
      <CardsWrapper>
        {links.map((item, idx) => {
          return (
            <>
              {idx !== 0 && <VerticalLine />}
              <LinkCardStyled key={item.url} data={item} />
            </>
          );
        })}
        <VerticalLine />
        <QrCodeU3 src={qrCodeU3} />
      </CardsWrapper>
      <ContentDividingLine />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const CardsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 200px;
  align-items: center;
  gap: 20px;
`;
const LinkCardStyled = styled(LinkCard)`
  width: 0px;
  flex: 1;
`;
const HorizontalLine = styled.span`
  display: inline-block;
  width: 100%;
  height: 1px;
  background: #000;
`;
const VerticalLine = styled.span`
  display: inline-block;
  width: 100px;
  height: 1px;
  transform: rotate(-90deg);
  flex-shrink: 0;
  background: #000;
`;
const QrCodeU3 = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 20px;
`;
