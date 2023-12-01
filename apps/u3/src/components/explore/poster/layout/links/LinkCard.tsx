import styled, { StyledComponentPropsWithRef } from 'styled-components';
import EllipsisText from '../../../../common/text/EllipsisText';

export type LinkCardData = {
  name: string;
  url: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: LinkCardData;
}
export default function LinkCard({ data, ...wrapperProps }: Props) {
  const { name, url } = data;
  return (
    <CardWrapper {...wrapperProps}>
      <Url>{url}</Url>
      <Title row={2}>{name}</Title>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 20px;
  overflow: hidden;
`;
const Title = styled(EllipsisText)`
  align-self: stretch;
  color: var(--14171-a, #14171a);
  font-family: Marion;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const Url = styled(EllipsisText)`
  color: #000;
  font-family: Marion;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
