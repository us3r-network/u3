import styled, { StyledComponentPropsWithRef } from 'styled-components';
import EllipsisText from '../../common/text/EllipsisText';

export type LinkCardData = {
  logo: string;
  name: string;
  url: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: LinkCardData;
}
export default function LinkCard({ data, ...wrapperProps }: Props) {
  const { logo, name, url } = data;
  return (
    <CardWrapper {...wrapperProps}>
      <CardBody>
        <Logo src={logo} />
        <Right>
          <Name>{name}</Name>
          <Url>{url}</Url>
        </Right>
      </CardBody>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  background: #1b1e23;
  overflow: hidden;
  cursor: pointer;
`;
const CardBody = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;
const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 40px;
`;
const Right = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
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
const Url = styled(EllipsisText)`
  color: var(--718096, #718096);

  /* Regular-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
