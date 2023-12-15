/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 11:12:40
 * @FilePath: /u3/apps/u3/src/components/news/contents/comment/ContentCommentLayout.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import ContentComments from './ContentComments';
import ContentCommentAddForm from './ContentCommentAddForm';

export default function ContentCommentLayout({
  linkId,
  link,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { linkId: string; link: any }) {
  return (
    <Wrapper {...wrapperProps}>
      <ContentCommentsStyled linkId={linkId} link={link} />
      <ContentCommentAddForm linkId={linkId} link={link} />
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
