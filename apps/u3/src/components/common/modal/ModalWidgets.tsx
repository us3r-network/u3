import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ReactComponent as Close } from '../icons/svgs/close.svg';

export function ModalCloseBtn(props: StyledComponentPropsWithRef<'div'>) {
  return (
    <ModalCloseBtnWrapper {...props}>
      <Close />
    </ModalCloseBtnWrapper>
  );
}

const ModalCloseBtnWrapper = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #14171a;
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
  }
`;

export const ModalTitle = styled.h3`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
`;

export const ModalDescription = styled.p`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
`;
