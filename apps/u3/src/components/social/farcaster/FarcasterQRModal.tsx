import QRCode from 'react-qr-code';
import styled from 'styled-components';

import ModalContainer from '../../common/modal/ModalContainer';
import {
  ModalCloseBtn,
  ModalDescription,
  ModalTitle,
} from '../../common/modal/ModalWidgets';

type Token = {
  token: string;
  deepLink: string;
};

export default function FarcasterQRModal({
  open,
  token,
  closeModal,
  afterCloseAction,
  showQR,
  warpcastErr,
}: {
  warpcastErr: string;
  token: Token;
  open: boolean;
  showQR: boolean;
  closeModal: () => void;
  afterCloseAction: () => void;
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={afterCloseAction}
    >
      <ModalBody>
        <ModalHeader>
          <ModalTitle>Farcaster handle verify</ModalTitle>
          <ModalCloseBtn onClick={closeModal} />
        </ModalHeader>

        {(warpcastErr && (
          <ModalDescription>
            {warpcastErr}
            <p>please try again in a few minutes</p>
          </ModalDescription>
        )) || (
          <>
            <ModalDescription>
              Login with Warpcast or apply for farcaster handle.
            </ModalDescription>
            {(showQR && <QRCode value={token.deepLink} />) || (
              <ModalDescription>Loading QR code...</ModalDescription>
            )}
          </>
        )}
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  width: 600px;
  /* height: 220px; */
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
