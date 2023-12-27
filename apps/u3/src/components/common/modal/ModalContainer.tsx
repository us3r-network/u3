import Modal from 'react-modal';
import { cn } from '@/lib/utils';

const modalStyles = {
  content: {
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
  contentTransform,
  id,
}: {
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void;
  afterCloseAction?: () => void;
  contentTransform?: string;
  contentTop?: string;
  zIndex?: number;
  id?: string;
}) {
  if (!open) {
    return null;
  }
  return (
    <Modal
      id={id}
      isOpen={open}
      onRequestClose={closeModal}
      onAfterClose={afterCloseAction}
      contentLabel="Modal Container"
      style={{
        content: {
          ...modalStyles.content,
          top: contentTop || '50%',
          transform: contentTransform || 'translate(-50%, -50%)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: zIndex || 40,
        },
      }}
      className={cn(
        'fixed w-full md:w-[600px] top-[50%] left-[50%]',
        'focus-visible:border-none focus-visible:outline-none '
      )}
    >
      {children}
    </Modal>
  );
}
