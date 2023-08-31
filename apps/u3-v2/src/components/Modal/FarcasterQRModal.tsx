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
        <ErrBox>
          {warpcastErr}
          <p>please try again in a few minutes</p>
          <button onClick={closeModal}>close</button>
        </ErrBox>
      )) || (
        <div>
          {(showQR && <QRCode value={token.deepLink} />) || <div>Loading</div>}
          <p>Sign-in with Farcaster</p>
        </div>
      )}
    </ModalContainer>
  )
}

const ErrBox = styled.div`
  color: #000;
`
