import styled, { StyledComponentPropsWithRef } from 'styled-components';
import EllipsisText from '../../../../common/text/EllipsisText';

export type DappData = {
  logo: string;
  name: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: DappData;
}
export default function LinkCard({ data, ...wrapperProps }: Props) {
  const { logo, name } = data;
  return (
    <CardWrapper {...wrapperProps}>
      <Logo src={logo} />
      <Name>{name}</Name>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 20px;
  object-fit: cover;
`;
const Name = styled(EllipsisText)`
  color: var(--14171-a, #14171a);
  text-align: center;
  font-family: Marion;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
