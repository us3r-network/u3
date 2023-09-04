import QRCode from 'react-qr-code'
import { Token } from '../../contexts/FarcasterCtx'
import ModalContainer from './ModalContainer'
import styled from 'styled-components'

export default function FarcasterQRModal({
  open,
  token,
  closeModal,
  afterCloseAction,
  showQR,
  warpcastErr,
}: {
  warpcastErr: string
  token: Token
  open: boolean
  showQR: boolean
  closeModal: () => void
  afterCloseAction: () => void
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={afterCloseAction}
    >
      {(warpcastErr && (
        <div>
          {warpcastErr}
          <p>please try again in a few minutes</p>
          <button onClick={closeModal}>close</button>
        </div>
      )) || (
        <ModalBody>
          <Title>Farcaster handle verify</Title>
          <Description>
            Login with Warpcast or apply for farcaster handle.
          </Description>
          {(showQR && <QRCode value={token.deepLink} />) || (
            <div>Loading QR code...</div>
          )}
        </ModalBody>
      )}
    </ModalContainer>
  )
}

const ModalBody = styled.div`
  width: 730px;
  /* height: 220px; */
  flex-shrink: 0;

  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 30px;
`

const Title = styled.h3`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`
const Description = styled.div`
  color: #fff;
  font-family: Baloo Bhai 2;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`
