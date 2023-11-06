import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { SocailPlatform } from '../../services/social/types';

type ShareLinkModalState = {
  isOpen: boolean;
  shareLink: string;
  shareLinkDefaultPlatform: SocailPlatform;
  shareLinkDefaultText: string;
  shareLinkEmbedTitle: string;
};
interface GlobalModalsContextValue {
  shareLinkModalState: ShareLinkModalState;
  setShareLinkModalState: React.Dispatch<
    React.SetStateAction<ShareLinkModalState>
  >;
  openShareLinkModal: (state: Omit<ShareLinkModalState, 'isOpen'>) => void;
  closeShareLinkModal: () => void;
}
const ShareLinkModalStateDefaultValue: ShareLinkModalState = {
  isOpen: false,
  shareLink: '',
  shareLinkDefaultPlatform: null,
  shareLinkDefaultText: '',
  shareLinkEmbedTitle: '',
};

export const GlobalModalsContext = createContext<GlobalModalsContextValue>({
  shareLinkModalState: ShareLinkModalStateDefaultValue,
  setShareLinkModalState: () => {},
  openShareLinkModal: () => {},
  closeShareLinkModal: () => {},
});

export function GlobalModalsProvider({ children }: PropsWithChildren) {
  const [shareLinkModalState, setShareLinkModalState] =
    useState<ShareLinkModalState>(ShareLinkModalStateDefaultValue);
  const openShareLinkModal = useCallback((state: any) => {
    setShareLinkModalState({
      isOpen: true,
      ...state,
    });
  }, []);
  const closeShareLinkModal = useCallback(() => {
    setShareLinkModalState(ShareLinkModalStateDefaultValue);
  }, []);

  return (
    <GlobalModalsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        shareLinkModalState,
        setShareLinkModalState,
        openShareLinkModal,
        closeShareLinkModal,
      }}
    >
      {children}
    </GlobalModalsContext.Provider>
  );
}

export function useGlobalModalsCtx() {
  const context = useContext(GlobalModalsContext);
  if (!context) {
    throw Error(
      'useGlobalModalsCtx can only be used within the GlobalModalsProvider component'
    );
  }
  return context;
}
