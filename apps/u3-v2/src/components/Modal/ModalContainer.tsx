import Modal from 'react-modal'

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    backdropFilter: 'blur(10px)',
    transform: 'translate(-50%, -50%)',
  },
}

export default function ModalContainer({
  children,
  open,
  closeModal,
  afterCloseAction,
}: {
  children: React.ReactNode
  open: boolean
  closeModal: () => void
  afterCloseAction?: () => void
}) {
  return (
    <Modal
      isOpen={open}
      onRequestClose={closeModal}
      onAfterClose={afterCloseAction}
      contentLabel="Modal Container"
      style={modalStyles}
    >
      {children}
    </Modal>
  )
}
