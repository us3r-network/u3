import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface NotificationStoreCtxValue {
  notifications: any;
  loadingNotifications: boolean;
  loadNotifications: () => void;
  openNotificationModal: boolean;
  setOpenNotificationModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultContextValue: NotificationStoreCtxValue = {
  notifications: null,
  loadingNotifications: false,
  loadNotifications: () => {},
  openNotificationModal: false,
  setOpenNotificationModal: () => {},
};

export const NotificationStoreCtx = createContext(defaultContextValue);

export function NotificationStoreProvider({ children }: PropsWithChildren) {
  const [openNotificationModal, setOpenNotificationModal] = useState(false);

  const [notifications, setNotifications] = useState(
    defaultContextValue.notifications
  );

  const loadNotifications = useCallback(async () => {}, []);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <NotificationStoreCtx.Provider
      value={useMemo(
        () => ({
          loadingNotifications,
          loadNotifications,
          notifications,
          openNotificationModal,
          setOpenNotificationModal,
        }),
        [
          loadingNotifications,
          loadNotifications,
          notifications,
          openNotificationModal,
          setOpenNotificationModal,
        ]
      )}
    >
      {children}
    </NotificationStoreCtx.Provider>
  );
}

export const useNotificationStore = () => {
  const ctx = useContext(NotificationStoreCtx);
  if (!ctx) {
    throw new Error(
      'useNotificationStore must be used within NotificationStoreProvider'
    );
  }
  return ctx;
};
