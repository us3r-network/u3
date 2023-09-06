import Modal from 'react-modal';

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    backdropFilter: 'blur(10px)',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    background: '#212228',
    padding: '0px',
    border: 'none',
  },
};

export default function ModalContainer({
  children,
  open,
  closeModal,
  afterCloseAction,
  zIndex,
}: {
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void;
  afterCloseAction?: () => void;
  zIndex?: number;
}) {
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      onAfterClose={afterCloseAction}
      contentLabel="Modal Container"
      style={{
        ...modalStyles,
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: zIndex || 1000,
        },
      }}
    >
      {children}
    </Modal>
  );
}
