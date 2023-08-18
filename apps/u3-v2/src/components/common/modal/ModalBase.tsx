import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import styles from "./ModalBase.module.css";

interface ModalBaseProps {
  title?: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isDismissable?: boolean;
  overlayClassName?: string;
  modalClassName?: string;
  dialogClassName?: string;
}
const ModalBase = ({
  title,
  children,
  isOpen,
  onOpenChange,
  isDismissable = true,
  overlayClassName = "",
  modalClassName = "",
  dialogClassName = "",
}: ModalBaseProps) => {
  return (
    <ModalOverlay
      className={`${styles.ModalOverlay} ${overlayClassName}`}
      isDismissable={isDismissable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <Modal className={`${styles.Modal} ${modalClassName}`}>
        <Dialog className={`${styles.Dialog} ${dialogClassName}`}>
          {!!title && <Heading className={styles.Heading}>{title}</Heading>}
          {children}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
};

export default ModalBase;
