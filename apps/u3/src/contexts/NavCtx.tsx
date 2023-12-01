/* eslint-disable no-plusplus */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { useXmtpClient } from './message/XmtpClientCtx';

export enum NavModalName {
  Notification = 'Notification',
  Message = 'Message',
  ContactUs = 'ContactUs',
}
interface NavCtxValue {
  openNotificationModal: boolean;
  setOpenNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
  openMessageModal: boolean;
  setOpenMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
  openContactUsModal: boolean;
  setOpenContactUsModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  renderNavItemText;
  switchNavModal: (name: string) => void;
}

const defaultContextValue: NavCtxValue = {
  openNotificationModal: false,
  setOpenNotificationModal: () => {},
  openMessageModal: false,
  setOpenMessageModal: () => {},
  openContactUsModal: false,
  setOpenContactUsModal: () => {},
  isOpen: false,
  setIsOpen: () => {},
  renderNavItemText: () => {},
  switchNavModal: () => {},
};

export interface NavCtxProviderProps {
  children: ReactNode;
}
export const NavCtx = createContext(defaultContextValue);
export function NavProvider({ children }: NavCtxProviderProps) {
  const [openNotificationModal, setOpenNotificationModal] = useState(
    defaultContextValue.openNotificationModal
  );
  const [openMessageModal, setOpenMessageModal] = useState(
    defaultContextValue.openMessageModal
  );

  const [openContactUsModal, setOpenContactUsModal] = useState(
    defaultContextValue.openContactUsModal
  );

  const switchNavModal = useCallback(
    (name: string) => {
      if (name !== NavModalName.Notification) setOpenNotificationModal(false);
      if (name !== NavModalName.Message) setOpenMessageModal(false);
      if (name !== NavModalName.ContactUs) setOpenContactUsModal(false);
      switch (name) {
        case NavModalName.Notification:
          setOpenNotificationModal((pre) => !pre);
          break;
        case NavModalName.Message:
          setOpenMessageModal((pre) => !pre);
          break;
        case NavModalName.ContactUs:
          setOpenContactUsModal((pre) => !pre);
          break;
        default:
          break;
      }
    },
    [setOpenNotificationModal, setOpenMessageModal, setOpenContactUsModal]
  );

  const { setCanEnableXmtp } = useXmtpClient();
  useEffect(() => {
    if (openMessageModal) {
      setCanEnableXmtp(true);
    }
  }, [openMessageModal]);
  const [isOpen, setIsOpen] = useState(defaultContextValue.isOpen);

  const navItemTextInnerEls = useRef(new Map());
  const renderNavItemText = useCallback(
    (text: string) => {
      if (navItemTextInnerEls.current.has(text)) {
        const innerEl = navItemTextInnerEls.current.get(text);
        innerEl.parentElement.style.width = `${innerEl.scrollWidth}px`;
      }
      return (
        <PcNavItemTextBox>
          <PcNavItemTextInner
            ref={(el) => {
              if (el) {
                navItemTextInnerEls.current.set(text, el);
              }
            }}
          >
            {text}
          </PcNavItemTextInner>
        </PcNavItemTextBox>
      );
    },
    [isOpen]
  );
  return (
    <NavCtx.Provider
      value={useMemo(
        () => ({
          openNotificationModal,
          setOpenNotificationModal,
          openMessageModal,
          setOpenMessageModal,
          openContactUsModal,
          setOpenContactUsModal,
          switchNavModal,
          isOpen,
          setIsOpen,
          renderNavItemText,
        }),
        [
          openNotificationModal,
          setOpenNotificationModal,
          openMessageModal,
          setOpenMessageModal,
          openContactUsModal,
          setOpenContactUsModal,
          switchNavModal,
          isOpen,
          setIsOpen,
          renderNavItemText,
        ]
      )}
    >
      {children}
    </NavCtx.Provider>
  );
}

export const useNav = () => {
  const ctx = useContext(NavCtx);
  if (!ctx) {
    throw new Error('useNav must be used within Nav');
  }
  return ctx;
};

export const PcNavItemTextBox = styled.div`
  overflow: hidden;
  transition: all 0.5s ease-out;
`;
export const PcNavItemTextInner = styled.div`
  white-space: nowrap;
`;
