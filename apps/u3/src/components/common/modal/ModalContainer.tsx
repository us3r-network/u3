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
    background: '#1B1E23',
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
  contentTop,
}: {
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void;
  afterCloseAction?: () => void;
  zIndex?: number;
  contentTop?: string;
}) {
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      onAfterClose={afterCloseAction}
      contentLabel="Modal Container"
      style={{
        content: {
          ...modalStyles.content,
          top: contentTop || '50%',
        },
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
