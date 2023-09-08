/* eslint-disable @typescript-eslint/await-thenable */
import styled from 'styled-components';
import ModalContainer from '../../common/modal/ModalContainer';

// eslint-disable-next-line import/no-cycle
import { useLensCtx } from '../../../contexts/AppLensCtx';
import {
  ModalCloseBtn,
  ModalDescription,
  ModalTitle,
} from '../../common/modal/ModalWidgets';
import { SocialButtonPrimary } from '../button/SocialButton';

export default function LensLoginModal({
  open,
  closeModal,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { isLogin, isLoginPending, lensLogin, lensLogout } = useLensCtx();

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <ModalBody>
        <ModalHeader>
          <ModalTitle>Lens handle verify</ModalTitle>
          <ModalCloseBtn onClick={closeModal} />
        </ModalHeader>

        <ModalDescription>
          Connect wallet which has Lens handle or join Lens waitlist.
        </ModalDescription>
        <Btns>
          <Button
            onClick={async () => {
              if (isLogin) {
                await lensLogout();
              } else {
                await lensLogin();
              }
              closeModal();
            }}
          >
            {(() => {
              if (isLoginPending) return 'Connecting ...';
              if (isLogin) return 'Connected';
              return 'Connect Wallet';
            })()}
          </Button>
          <Button
            onClick={() => {
              window.open('https://waitlist.lens.xyz/', '_blank');
            }}
          >
            Join waitlist
          </Button>
        </Btns>
      </ModalBody>
    </ModalContainer>
  );
}
const ModalBody = styled.div`
  width: 600px;
  height: 220px;
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
const Btns = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Button = styled(SocialButtonPrimary)`
  min-width: 140px;
`;
