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
import { useWalletClient } from 'wagmi';
import {
  AttachmentCodec,
  RemoteAttachmentCodec,
} from '@xmtp/content-type-remote-attachment';
import { loadKeys, storeKeys } from '../../utils/xmtp';
import { XMTP_ENV } from '../../constants/xmtp';

interface XmtpClientCtxValue {
  xmtpClient: Client | null;
  enablingXmtp: boolean;
  enableXmtp: (signer: Signer) => Promise<void>;
}

const defaultContextValue: XmtpClientCtxValue = {
  xmtpClient: null,
  enablingXmtp: false,
  enableXmtp: async () => {},
};

export const XmtpClientCtx = createContext(defaultContextValue);

export function XmtpClientProvider({ children }: PropsWithChildren) {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [enablingXmtp, setEnablingXmtp] = useState(false);
  const { data } = useWalletClient();

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

  const enableXmtp = useCallback(async (walletSigner: Signer) => {
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

  useEffect(() => {
    if (!signer) {
      setXmtpClient(null);
      return;
    }
    enableXmtp(signer);
  }, [signer, enableXmtp]);

  return (
    <XmtpClientCtx.Provider
      value={useMemo(
        () => ({ xmtpClient, enablingXmtp, enableXmtp }),
        [xmtpClient, enablingXmtp, enableXmtp]
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