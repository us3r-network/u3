import styled from 'styled-components'
import ModalContainer from '../Modal/ModalContainer'
import { useLensCtx } from '../../contexts/AppLensCtx'
import { ButtonPrimary } from '../common/button/ButtonBase'

export default function LensLoginModal({
  open,
  closeModal,
}: {
  open: boolean
  closeModal: () => void
}) {
  const { isLogin, isLoginPending, lensLogin, lensLogout } = useLensCtx()

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <ModalBody>
        <Title>Lens handle verify</Title>
        <Description>
          Connect wallet which has Lens handle or join Lens waitlist.
        </Description>
        <Btns>
          <Button
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
              if (isLoginPending) return 'Connecting ...'
              if (isLogin) return 'Connected'
              return 'Connect Wallet'
            })()}
          </Button>
          <Button
            onClick={() => {
              window.open('https://waitlist.lens.xyz/', '_blank')
            }}
          >
            Join waitlist
          </Button>
        </Btns>
      </ModalBody>
    </ModalContainer>
  )
}
const ModalBody = styled.div`
  width: 730px;
  height: 220px;
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
const Btns = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`
const Button = styled(ButtonPrimary)`
  width: 140px;
`
