import { Client, Signer } from '@xmtp/xmtp-js';
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment';
import { isMobile } from 'react-device-detect';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { loadKeys, storeKeys } from '../../utils/message/xmtp';
import { XMTP_ENV } from '../../constants/xmtp';

export enum MessageRoute {
  SEARCH = 'search',
  DETAIL = 'detail',
}

type MessageRouteParams = {
  route: MessageRoute;
  peerAddress?: string;
};

interface XmtpClientCtxValue {
  xmtpClient: Client | null;
  enablingXmtp: boolean;
  enableXmtp: () => Promise<void>;
  enableXmtpWithSigner: (signer: Signer) => Promise<void>;
  disconnectXmtp: () => void;
  canEnableXmtp: boolean;
  setCanEnableXmtp: (canEnable: boolean) => void;
  messageRouteParams: MessageRouteParams;
  setMessageRouteParams: React.Dispatch<
    React.SetStateAction<MessageRouteParams>
  >;
}

const defaultContextValue: XmtpClientCtxValue = {
  xmtpClient: null,
  enablingXmtp: false,
  enableXmtp: async () => {},
  enableXmtpWithSigner: async () => {},
  disconnectXmtp: () => {},
  canEnableXmtp: false,
  setCanEnableXmtp: () => {},
  messageRouteParams: { route: MessageRoute.SEARCH },
  setMessageRouteParams: () => {},
};

export const XmtpClientCtx = createContext(defaultContextValue);

export function XmtpClientProvider({ children }: PropsWithChildren) {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [enablingXmtp, setEnablingXmtp] = useState(false);
  const [canEnableXmtp, setCanEnableXmtp] = useState(false);
  const { data } = useWalletClient();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [messageRouteParams, setMessageRouteParams] =
    useState<MessageRouteParams>({ route: MessageRoute.SEARCH });

  /**
   * // TODO wagmi 的 wallet对象中getAddress, signMessage方法不符合xmtp-js的Signer定义要求，这里是临时方案
   *
   * xmtp-js issues: https://github.com/xmtp/xmtp-js/issues/416
   */
  const signer = useMemo(
    () =>
      data && !!data.account && !!(data as any)?.signMessage
        ? {
            getAddress: async (): Promise<string> => {
              const address = await (data.account.address as any);
              return address ?? '';
            },
            signMessage: async (message: string): Promise<string> => {
              const signature = await (data as any)?.signMessage({
                message,
                account: data.account,
              });
              return signature ?? '';
            },
          }
        : null,
    [data]
  );

  const enableXmtpWithSigner = useCallback(async (walletSigner: Signer) => {
    if (!walletSigner) {
      return;
    }
    try {
      setEnablingXmtp(true);
      const address = await walletSigner.getAddress();
      let keys = loadKeys(address);
      if (!keys) {
        keys = await Client.getKeys(walletSigner, {
          env: XMTP_ENV,
        });
        storeKeys(address, keys);
      }
      const client = await Client.create(null, {
        env: XMTP_ENV,
        privateKeyOverride: keys,
      });
      client.registerCodec(new AttachmentCodec());
      client.registerCodec(new RemoteAttachmentCodec());

      setXmtpClient(client);
    } catch (error) {
      setXmtpClient(null);
    } finally {
      setEnablingXmtp(false);
    }
  }, []);

  const enableXmtp = useCallback(async () => {
    if (!isConnected || !signer) {
      openConnectModal();
      return;
    }
    await enableXmtpWithSigner(signer);
  }, [signer, enableXmtpWithSigner, openConnectModal]);

  const disconnectXmtp = useCallback(() => {
    setXmtpClient(null);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (canEnableXmtp) {
      if (signer) {
        enableXmtpWithSigner(signer);
        return;
      }
    }
    setXmtpClient(null);
  }, [signer, enableXmtpWithSigner, isMobile, canEnableXmtp]);

  return (
    <XmtpClientCtx.Provider
      value={useMemo(
        () => ({
          xmtpClient,
          enablingXmtp,
          enableXmtp,
          enableXmtpWithSigner,
          disconnectXmtp,
          canEnableXmtp,
          setCanEnableXmtp,
          messageRouteParams,
          setMessageRouteParams,
        }),
        [
          xmtpClient,
          enablingXmtp,
          enableXmtp,
          enableXmtpWithSigner,
          disconnectXmtp,
          canEnableXmtp,
          setCanEnableXmtp,
          messageRouteParams,
          setMessageRouteParams,
        ]
      )}
    >
      {children}
    </XmtpClientCtx.Provider>
  );
}

export const useXmtpClient = () => {
  const ctx = useContext(XmtpClientCtx);
  if (!ctx) {
    throw new Error('useXmtpClient must be used within XmtpClientProvider');
  }
  return ctx;
};
