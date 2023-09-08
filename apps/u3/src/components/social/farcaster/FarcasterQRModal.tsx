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
          <ModalTitle>Login with mobile</ModalTitle>
          <ModalCloseBtn onClick={closeModal} />
        </ModalHeader>
        {(warpcastErr && (
          <ModalDescription>
            {warpcastErr}
            <p>please try again in a few minutes</p>
          </ModalDescription>
        )) || (
          <ModalContent>
            <Left>
              <Description>
                Scan the QR code with the camera app on your device with
                Warpcast installed.
              </Description>
              <DownloadLink
                href="https://warpcast.com/~/download"
                target="blank"
              >
                Download Warpcast
              </DownloadLink>
            </Left>
            <Right>
              {(showQR && <QRCode value={token.deepLink} />) || (
                <Description>Loading QR code...</Description>
              )}
            </Right>
          </ModalContent>
        )}
      </ModalBody>
    </ModalContainer>
  );
}

const ModalBody = styled.div`
  width: 480px;
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
  gap: 40px;
  justify-content: space-between;
`;
const Left = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Right = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 200px;
    height: 200px;
  }
`;
const DownloadLink = styled.a`
  font-family: Rubik;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */

  background: linear-gradient(88deg, #cd62ff 0%, #62aaff 99.21%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
