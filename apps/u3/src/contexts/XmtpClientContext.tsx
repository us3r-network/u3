/* eslint-disable @typescript-eslint/no-shadow */
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
import { loadKeys, storeKeys } from '../utils/xmtp';

interface XmtpClientContextValue {
  xmtpClient: Client | null;
  enablingXmtp: boolean;
  enableXmtp: (signer: Signer) => Promise<void>;
}

const defaultContextValue: XmtpClientContextValue = {
  xmtpClient: null,
  enablingXmtp: false,
  enableXmtp: async () => {},
};

export const XmtpClientContext = createContext(defaultContextValue);

export function XmtpClientContextProvider({ children }: PropsWithChildren) {
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
      data
        ? {
            // eslint-disable-next-line @typescript-eslint/require-await
            getAddress: async (): Promise<string> => {
              return data.account.address;
            },
            signMessage: async (message: string): Promise<string> => {
              const signature = await data?.signMessage({
                message,
                account: data.account,
              });
              return signature ?? '';
            },
          }
        : null,
    [data]
  );

  const enableXmtp = useCallback(async (signer: Signer) => {
    if (!signer) {
      return;
    }
    try {
      setEnablingXmtp(true);
      const address = await signer.getAddress();
      let keys = loadKeys(address);
      if (!keys) {
        keys = await Client.getKeys(signer, {
          env: 'dev',
        });
        storeKeys(address, keys);
      }
      const client = await Client.create(null, {
        env: 'dev',
        privateKeyOverride: keys,
      });

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
  }, [signer]);

  return (
    <XmtpClientContext.Provider
      value={useMemo(
        () => ({ xmtpClient, enablingXmtp, enableXmtp }),
        [xmtpClient, enablingXmtp, enableXmtp]
      )}
    >
      {children}
    </XmtpClientContext.Provider>
  );
}

export const useXmtpClient = () => {
  const ctx = useContext(XmtpClientContext);
  if (!ctx) {
    throw new Error(
      'useXmtpClient must be used within XmtpClientContextProvider'
    );
  }
  return ctx;
};