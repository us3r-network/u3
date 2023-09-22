import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { SocialButtonPrimary } from '../social/button/SocialButton';
import { ReactComponent as MessageChatSquareSvg } from '../icons/svgs/message-chat-square.svg';

export function SocialMessageChatBtn(
  props: StyledComponentPropsWithRef<'button'>
) {
  return (
    <SocialMessageChatBtnWrapper {...props}>
      <MessageChatSquareSvg />
    </SocialMessageChatBtnWrapper>
  );
}
export const SocialMessageChatBtnWrapper = styled(SocialButtonPrimary)`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  padding: 10px;
  svg {
    path {
      stroke: #14171a;
    }
  }
`;
