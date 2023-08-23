import QRCode from 'react-qr-code'
import { Token } from '../../contexts/FarcasterCtx'
import ModalContainer from './ModalContainer'

export default function FarcasterQRModal({
  open,
  token,
  closeModal,
  afterCloseAction,
  showQR,
}: {
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
      <div>
        {(showQR && <QRCode value={token.deepLink} />) || <div>Loading</div>}
        <p>Sign-in with Farcaster</p>
      </div>
    </ModalContainer>
  )
}
