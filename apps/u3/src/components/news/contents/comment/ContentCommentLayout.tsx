import styled, { StyledComponentPropsWithRef } from 'styled-components';
import ContentComments from './ContentComments';
import ContentCommentAddForm from './ContentCommentAddForm';

export default function ContentCommentLayout({
  linkId,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { linkId: string }) {
  return (
    <Wrapper {...wrapperProps}>
      <ContentCommentsStyled linkId={linkId} />
      <ContentCommentAddForm linkId={linkId} />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;
const ContentCommentsStyled = styled(ContentComments)`
  flex: 1;
`;
