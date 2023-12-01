import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ScoresAvg } from '@us3r-network/link';
import EllipsisText from '../../common/text/EllipsisText';
import CardBase from '../../common/card/CardBase';
import Badge from '../../dapp/Badge';
import { formatFilterShowName } from '../../../utils/shared/filter';

export type DappData = {
  logo: string;
  name: string;
  types: string[];
  recReason?: string;
  linkStreamId?: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: DappData;
}
export default function LinkCard({ data, ...wrapperProps }: Props) {
  const {
    logo,
    name,
    types,
    recReason = 'High Score Dapp',
    linkStreamId,
  } = data;
  return (
    <CardWrapper {...wrapperProps}>
      <CardBody>
        <Left>
          <Name>{name}</Name>
          <RecReason>{recReason}</RecReason>
          <LeftBottom>
            <TypesWrapper>
              {types.map((item) => (
                <Badge key={item} text={formatFilterShowName(item)} />
              ))}
            </TypesWrapper>
            {linkStreamId && <ScoresAvg linkId={data.linkStreamId} />}
          </LeftBottom>
        </Left>
        <Logo src={logo} />
      </CardBody>
    </CardWrapper>
  );
}

const CardWrapper = styled(CardBase)`
  width: 100%;
  background: #1b1e23;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
`;
const CardBody = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;
const Left = styled.div`
  width: 0;
  flex: 1;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
`;
const Name = styled(EllipsisText)`
  color: #fff;

  /* medium-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
const RecReason = styled.span`
  /* Regular-14 */
  font-family: Rubik;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: linear-gradient(52deg, #cd62ff 35.31%, #62aaff 89.64%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: auto;
`;
const LeftBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 6px;
`;
const TypesWrapper = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  gap: 10px;
  overflow: hidden;
`;
const Logo = styled.img`
  width: 110px;
  height: 100%;
  object-fit: cover;
`;
