/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 11:11:49
 * @FilePath: /u3/apps/u3/src/components/news/contents/action/ContentActions.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled, { StyledComponentPropsWithRef, css } from 'styled-components';
import { Comments } from '@us3r-network/link';
import { ButtonPrimaryLineCss } from '../../../common/button/ButtonBase';
import { FavorButtonBase } from '../../../shared/button/FavorButtonBase';
import { VoteButtonBase } from '../../../shared/button/VoteButtonBase';
import IconMessage from '../../../common/icons/IconMessage';

export default function ContentActions({
  linkId,
  link,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { linkId: string; link: any }) {
  return (
    <Wrapper {...wrapperProps}>
      <VoteButtonStyled linkId={linkId} link={link} />
      <CommentButtonStyled linkId={linkId} link={link}>
        {({ commentsCount }) => {
          return (
            <>
              <IconMessage />
              {commentsCount || 0}
            </>
          );
        }}
      </CommentButtonStyled>
      <FavorButtonStyled linkId={linkId} link={link} />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const ButtonCss = css`
  ${ButtonPrimaryLineCss}
  padding: 0;
  width: 180px;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  padding: 12px;
  box-sizing: border-box;
  color: #fff;
  svg {
    width: 20px;
    height: 20px;
    fill: #fff;
  }
`;
const VoteButtonStyled = styled(VoteButtonBase)`
  ${ButtonCss}
`;
const CommentButtonStyled = styled(Comments)`
  ${ButtonCss}
  svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: #718096;
  }
`;

const FavorButtonStyled = styled(FavorButtonBase)`
  ${ButtonCss}
`;
