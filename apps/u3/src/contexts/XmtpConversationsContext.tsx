/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Client,
  useClient,
  Conversation,
  DecodedMessage,
  Stream,
} from '@xmtp/react-sdk';
import { useConnect, useWalletClient } from 'wagmi';
import { loadKeys, storeKeys } from '../utils/xmtp';

type SendMessageAction = (
  convoAddress: string,
  message: string,
  opts?: {
    onSuccess?: () => void;
    onFail?: (error: Error) => void;
  }
) => Promise<void>;

type StartNewConvoAction = (
  convoAddress: string,
  opts?: {
    onSuccess?: () => void;
    onFail?: (error: Error) => void;
  }
) => Promise<void>;

interface MessageContextValue {
  conversations: Map<string, Conversation>;
  convoMessages: Map<string, DecodedMessage[]>;
  loadingConversations: boolean;
  loadConversations: () => void;
  sendMessage: SendMessageAction;
  startNewConvo: StartNewConvoAction;
  selectedConvoAddress: string;
  setSelectedConvoAddress: (convo: string) => void;
}

const defaultContextValue: MessageContextValue = {
  conversations: new Map(),
  convoMessages: new Map(),
  loadingConversations: false,
  loadConversations: () => {},
  sendMessage: () => Promise.resolve(),
  startNewConvo: () => Promise.resolve(),
  selectedConvoAddress: '',
  setSelectedConvoAddress: () => {},
};

export const MessageContext = createContext(defaultContextValue);

export function MessageContextProvider({ children }: PropsWithChildren) {
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
  const { client, initialize } = useClient();

  useEffect(() => {
    if (!signer) {
      return;
    }
    (async () => {
      try {
        const address = await signer.getAddress();
        let keys = loadKeys(address);
        if (!keys) {
          keys = await Client.getKeys(signer, {
            env: 'dev',
          });
          storeKeys(address, keys);
        }
        await initialize({
          keys,
          signer,
          options: {
            env: 'dev',
          },
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, [signer]);

  const [conversations, setConversations] = useState(
    defaultContextValue.conversations
  );

  const [convoMessages, setConvoMessages] = useState(
    defaultContextValue.convoMessages
  );

  const [loadingConversations, setLoadingConversations] = useState(false);

  const [selectedConvoAddress, setSelectedConvoAddress] = useState(
    defaultContextValue.selectedConvoAddress
  );

  const loadConversations = useCallback(async () => {
    if (!client) {
      setConversations(defaultContextValue.conversations);
      return;
    }
    setLoadingConversations(true);
    try {
      const convos = (await client.conversations.list()).filter(
        (conversation) => !conversation.context?.conversationId
      );
      const convoMessagesMap = new Map();
      await Promise.all(
        convos
          .filter((convo) => convo.peerAddress !== client.address)
          .map(async (convo) => {
            if (convo.peerAddress !== client.address) {
              const messages = await convo.messages();
              convoMessagesMap.set(convo.peerAddress, messages);
            }
          })
      );

      const convosMap = new Map(convos.map((c) => [c.peerAddress, c]));

      setConversations(convosMap);
      setConvoMessages(convoMessagesMap);
    } catch (error) {
      console.error(error);
      setConversations(defaultContextValue.conversations);
      setConvoMessages(defaultContextValue.convoMessages);
    }
    setLoadingConversations(false);
  }, [client]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const convoStreamRef = useRef<Stream<Conversation> | null>(null);
  const convoStreamSub = useCallback(
    async (clientAddress: string, stream: Stream<Conversation>) => {
      for await (const convo of stream) {
        if (convo.peerAddress !== clientAddress) {
          const messages = await convo.messages();
          setConversations((prev) => {
            const newConversations = new Map(prev);
            newConversations.set(convo.peerAddress, convo);
            return newConversations;
          });
          setConvoMessages((prev) => {
            const newConvoMessages = new Map(prev);
            newConvoMessages.set(convo.peerAddress, messages);
            return newConvoMessages;
          });
        }
      }
    },
    []
  );
  useEffect(() => {
    const closeStream = async () => {
      if (!convoStreamRef.current) return;
      await convoStreamRef.current.return();
      convoStreamRef.current = null;
    };
    if (!client) {
      closeStream();
      setConversations(defaultContextValue.conversations);
      setConvoMessages(defaultContextValue.convoMessages);
      return;
    }

    (async () => {
      convoStreamRef.current = await client.conversations.stream();
      convoStreamSub(client.address, convoStreamRef.current);
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      closeStream();
    };
  }, [client]);

  const messageStreamsRef = useRef<Map<string, Stream<DecodedMessage>>>(
    new Map()
  );
  const messageStreamSub = useCallback(
    async (address: string, stream: Stream<DecodedMessage>) => {
      for await (const msg of stream) {
        setConvoMessages((prev) => {
          const prevConvoMessages = new Map(prev);
          const newMessages = prevConvoMessages.get(address) ?? [];
          newMessages.push(msg);
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item.id, item])).values()
            ),
          ];
          prevConvoMessages.set(address, uniqueMessages);
          return prevConvoMessages;
        });
      }
    },
    []
  );
  useEffect(() => {
    const closeStream = async () => {
      if (!messageStreamsRef.current) return;
      for (const stream of messageStreamsRef.current.values()) {
        await stream.return();
      }
      messageStreamsRef.current.clear();
    };

    if (!client) {
      closeStream();
      return;
    }

    (async () => {
      for (const convo of conversations.values()) {
        if (messageStreamsRef.current.has(convo.peerAddress)) continue;
        const stream = await convo.streamMessages();
        messageStreamsRef.current.set(convo.peerAddress, stream);
      }
      for (const [address, stream] of messageStreamsRef.current.entries()) {
        messageStreamSub(address, stream);
      }
    })();

    return () => {
      closeStream();
    };
  }, [conversations, client]);

  const startNewConvo: StartNewConvoAction = useCallback(
    async (convoAddress, { onSuccess, onFail }) => {
      try {
        if (!client) {
          throw new Error('Please connect to an XMTP account');
        }
        const isOnNetwork = await client.canMessage(convoAddress);
        if (!isOnNetwork) {
          throw new Error(
            "Recipient hasn't created an XMTP identity and can't receive messages"
          );
        }
        const convo = await client.conversations.newConversation(convoAddress);
        await convo.send('hi');
        if (onSuccess) {
          onSuccess();
        }
        setSelectedConvoAddress(convoAddress);
      } catch (error) {
        if (onFail) {
          onFail(error);
        }
      }
    },
    [client]
  );

  const sendMessage: SendMessageAction = useCallback(
    async (convoAddress: string, message: string, { onSuccess, onFail }) => {
      if (!convoAddress) {
        return;
      }
      try {
        if (!client) {
          throw new Error('Please connect to an XMTP account');
        }
        const conversation = await client.conversations.newConversation(
          convoAddress
        );
        await conversation.send(message);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        if (onFail) {
          onFail(error);
        }
      }
    },
    [client]
  );

  return (
    <MessageContext.Provider
      value={useMemo(
        () => ({
          conversations,
          convoMessages,
          loadingConversations,
          loadConversations,
          sendMessage,
          startNewConvo,
          selectedConvoAddress,
          setSelectedConvoAddress,
        }),
        [
          conversations,
          convoMessages,
          loadingConversations,
          loadConversations,
          sendMessage,
          startNewConvo,
          selectedConvoAddress,
          setSelectedConvoAddress,
        ]
      )}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessage = () => {
  const ctx = useContext(MessageContext);
  if (!ctx) {
    throw new Error('useMessage must be used within MessageContextProvider');
  }
  return ctx;
};
