/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-04 10:17:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 14:12:50
 * @Description: file description
 */
import Modal from 'react-modal';
import styled from 'styled-components';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import ModalBase, {
  ModalBaseBody,
  ModalBaseProps,
  ModalBaseTitle,
} from '../common/modal/ModalBase';
import { Close } from '../common/icons/close';

type Props = ModalBaseProps & {
  onClose?: () => void;
  onConfirm?: () => void;
};
export default function LogoutConfirmModal({
  onClose,
  onConfirm,
  backdropFilter = true,
  ...otherProps
}: Props) {
  return (
    <ModalBase backdropFilter={backdropFilter} {...otherProps}>
      <ModalBody>
        <Header>
          <ModalBaseTitle>Logout</ModalBaseTitle>
          <CloseBox onClick={onClose}>
            <Close />
          </CloseBox>
        </Header>
        <Description>Are you sure to log out?</Description>
        <Buttons>
          <CancelBtn onClick={onClose}>No</CancelBtn>
          <ConfirmBtn onClick={onConfirm}>Yes</ConfirmBtn>
        </Buttons>
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled(ModalBaseBody)`
  margin-top: 50vh;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 380px;
  z-index: 1;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CloseBox = styled.div`
  cursor: pointer;
`;
const Description = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  opacity: 0.8;
`;
const Buttons = styled.div`
  display: flex;
  gap: 24px;
`;
const CancelBtn = styled(ButtonPrimaryLine)`
  flex: 1;
`;
const ConfirmBtn = styled(ButtonPrimary)`
  flex: 1;
`;
