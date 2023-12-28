import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { SocialPlatform } from '../../services/social/types';

type ShareLinkModalState = {
  isOpen: boolean;
  shareLink: string;
  shareLinkDefaultPlatform?: SocialPlatform;
  shareLinkDefaultText: string;
  shareLinkEmbedTitle: string;
  shareLinkEmbedImg?: string;
  shareLinkDomain?: string;
  platforms?: SocialPlatform[];
  onSubmitEnd?: () => void;
};
type CommentLinkModalState = {
  isOpen: boolean;
  link: string;
  platform: SocialPlatform;
};
interface GlobalModalsContextValue {
  shareLinkModalState: ShareLinkModalState;
  setShareLinkModalState: React.Dispatch<
    React.SetStateAction<ShareLinkModalState>
  >;
  openShareLinkModal: (state: Omit<ShareLinkModalState, 'isOpen'>) => void;
  closeShareLinkModal: () => void;
  commentLinkModalState: CommentLinkModalState;
  setCommentLinkModalState: React.Dispatch<
    React.SetStateAction<CommentLinkModalState>
  >;
  openCommentLinkModal: (state: Omit<CommentLinkModalState, 'isOpen'>) => void;
  closeCommentLinkModal: () => void;
}
const ShareLinkModalStateDefaultValue: ShareLinkModalState = {
  isOpen: false,
  shareLink: '',
  shareLinkDefaultPlatform: null,
  shareLinkDefaultText: '',
  shareLinkEmbedTitle: '',
};
const CommentLinkModalStateDefaultValue: CommentLinkModalState = {
  isOpen: false,
  link: '',
  platform: null,
};
export const GlobalModalsContext = createContext<GlobalModalsContextValue>({
  shareLinkModalState: ShareLinkModalStateDefaultValue,
  setShareLinkModalState: () => {},
  openShareLinkModal: () => {},
  closeShareLinkModal: () => {},
  commentLinkModalState: CommentLinkModalStateDefaultValue,
  setCommentLinkModalState: () => {},
  openCommentLinkModal: () => {},
  closeCommentLinkModal: () => {},
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

  const [commentLinkModalState, setCommentLinkModalState] =
    useState<CommentLinkModalState>(CommentLinkModalStateDefaultValue);
  const openCommentLinkModal = useCallback((state: any) => {
    setCommentLinkModalState({
      isOpen: true,
      ...state,
    });
  }, []);
  const closeCommentLinkModal = useCallback(() => {
    setCommentLinkModalState(CommentLinkModalStateDefaultValue);
  }, []);

  return (
    <GlobalModalsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        shareLinkModalState,
        setShareLinkModalState,
        openShareLinkModal,
        closeShareLinkModal,
        commentLinkModalState,
        setCommentLinkModalState,
        openCommentLinkModal,
        closeCommentLinkModal,
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
