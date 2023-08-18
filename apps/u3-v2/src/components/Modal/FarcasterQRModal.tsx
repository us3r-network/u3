import QRCode from 'react-qr-code'
import { useFarcasterCtx } from '../../contexts/farcaster'
import ModalContainer from './ModalContainer'

export default function FarcasterQRModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { token } = useFarcasterCtx()
  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div>
        <QRCode value={token.deepLink} />
        <p>Sign-in with Farcaster</p>
      </div>
    </ModalContainer>
  )
}
