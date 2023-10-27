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

interface NavCtxValue {
  openNotificationModal: boolean;
  setOpenNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
  openMessageModal: boolean;
  setOpenMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  renderNavItemText;
}

const defaultContextValue: NavCtxValue = {
  openNotificationModal: false,
  setOpenNotificationModal: () => {},
  openMessageModal: false,
  setOpenMessageModal: () => {},
  isOpen: false,
  setIsOpen: () => {},
  renderNavItemText: () => {},
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
          isOpen,
          setIsOpen,
          renderNavItemText,
        }),
        [
          openNotificationModal,
          setOpenNotificationModal,
          openMessageModal,
          setOpenMessageModal,
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
