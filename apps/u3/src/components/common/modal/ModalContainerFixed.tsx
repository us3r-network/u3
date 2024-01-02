import Modal from 'react-modal';
import { cn } from '@/lib/utils';

const modalStyles = {
  content: {
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    background: '#1B1E23',
    padding: '0px',
    border: 'none',
  },
};

export default function ModalContainerFixed({
  children,
  open,
  closeModal,
  afterCloseAction,
  zIndex,
  id,
  className,
  onAfterOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void;
  afterCloseAction?: () => void;
  onAfterOpen?: () => void;
  zIndex?: number;
  id?: string;
  className?: string;
}) {
  if (!open) {
    return null;
  }

  return (
    <Modal
      id={id}
      isOpen={open}
      onAfterOpen={onAfterOpen}
      onRequestClose={closeModal}
      onAfterClose={afterCloseAction}
      contentLabel="Modal Container"
      style={{
        content: {
          ...modalStyles.content,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: zIndex || 40,
        },
      }}
      className={cn(
        'fixed top-[100px] left-[50%]',
        'focus-visible:border-none focus-visible:outline-none',
        'transform -translate-x-1/2',
        className || ''
      )}
    >
      {children}
    </Modal>
  );
}
