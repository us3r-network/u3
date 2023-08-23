import styled from 'styled-components'
import ModalContainer from '../Modal/ModalContainer'
import { useLensAuth } from '../../contexts/AppLensCtx'

export default function LensLoginModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { isLogin, isLoginPending, lensLogin, lensLogout } = useLensAuth()

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <ModalBody>
        <Description>Please login to Lens.</Description>
        <button
          onClick={async () => {
            if (isLogin) {
              await lensLogout()
            } else {
              await lensLogin()
            }
            closeModal()
          }}
        >
          {(() => {
            if (isLoginPending) return 'Loading...'
            if (isLogin) return 'Sign-out from lens'
            return 'Sign-in with lens'
          })()}
        </button>
      </ModalBody>
    </ModalContainer>
  )
}
const ModalBody = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`
const Description = styled.div`
  text-align: center;
`
