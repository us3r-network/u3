import styled, { StyledComponentPropsWithRef, css } from 'styled-components';
import { Comments } from '@us3r-network/link';
import { ButtonPrimaryLineCss } from '../../../common/button/ButtonBase';
import { FavorButtonBase } from '../../../shared/button/FavorButtonBase';
import { VoteButtonBase } from '../../../shared/button/VoteButtonBase';
import IconMessage from '../../../common/icons/IconMessage';

export default function ContentActions({
  linkId,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & { linkId: string }) {
  return (
    <Wrapper {...wrapperProps}>
      <VoteButtonStyled linkId={linkId} />
      <CommentButtonStyled linkId={linkId}>
        {({ commentsCount }) => {
          return (
            <>
              <IconMessage />
              {commentsCount || 0}
            </>
          );
        }}
      </CommentButtonStyled>
      <FavorButtonStyled linkId={linkId} />
    </Wrapper>
  );
}
const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
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
