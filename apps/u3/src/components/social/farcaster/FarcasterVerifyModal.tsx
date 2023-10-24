import ModalContainer from 'src/components/common/modal/ModalContainer';
import {
  ModalCloseBtn,
  ModalTitle,
} from 'src/components/common/modal/ModalWidgets';
import styled from 'styled-components';

export default function FarcasterVerifyModal({
  open,
  closeAction,
  addCountAction,
  registerAction,
}: {
  open: boolean;
  closeAction: () => void;
  addCountAction: () => void;
  registerAction: () => void;
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={closeAction}
      // afterCloseAction={afterCloseAction}
    >
      <ModalBody>
        <ModalHeader>
          <ModalTitle>Farcaster handle verify</ModalTitle>
          <ModalCloseBtn onClick={closeAction} />
        </ModalHeader>

        <ModalContent>
          <Description>
            Add account with Warpcast or register a new farcaster ID.
          </Description>
          <Ops>
            <button type="button" onClick={() => addCountAction()}>
              Add account
            </button>
            <button type="button" onClick={() => registerAction()}>
              Register
            </button>
          </Ops>
        </ModalContent>
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  width: fit-content;
  width: 600px;
  flex-shrink: 0;

  padding: 30px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const Description = styled.span`
  color: #718096;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 187.5% */
`;
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  justify-content: space-between;
`;

const Ops = styled.div`
  display: flex;
  gap: 20px;
  > button {
    width: 140px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 10px;
    background: linear-gradient(85deg, #cd62ff 0%, #62aaff 100%);
    border: none;
    outline: none;

    cursor: pointer;
    color: #000;
    font-family: Baloo Bhai 2;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;
