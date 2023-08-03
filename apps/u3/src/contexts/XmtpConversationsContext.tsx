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
import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js';
import { useXmtpClient } from './XmtpClientContext';

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

interface XmtpConversationsContextValue {
  conversations: Map<string, Conversation>;
  convoMessages: Map<string, DecodedMessage[]>;
  loadingConversations: boolean;
  loadConversations: () => void;
  sendMessage: SendMessageAction;
  startNewConvo: StartNewConvoAction;
  selectedConvoAddress: string;
  setSelectedConvoAddress: (convo: string) => void;
}

const defaultContextValue: XmtpConversationsContextValue = {
  conversations: new Map(),
  convoMessages: new Map(),
  loadingConversations: false,
  loadConversations: () => {},
  sendMessage: () => Promise.resolve(),
  startNewConvo: () => Promise.resolve(),
  selectedConvoAddress: '',
  setSelectedConvoAddress: () => {},
};

export const XmtpConversationsContext = createContext(defaultContextValue);

export function XmtpConversationsContextProvider({
  children,
}: PropsWithChildren) {
  const { xmtpClient } = useXmtpClient();

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
    if (!xmtpClient) {
      setConversations(defaultContextValue.conversations);
      return;
    }
    setLoadingConversations(true);
    try {
      const convos = (await xmtpClient.conversations.list()).filter(
        (conversation) => !conversation.context?.conversationId
      );
      const convoMessagesMap = new Map();
      await Promise.all(
        convos
          .filter((convo) => convo.peerAddress !== xmtpClient.address)
          .map(async (convo) => {
            if (convo.peerAddress !== xmtpClient.address) {
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
  }, [xmtpClient]);

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
    if (!xmtpClient) {
      closeStream();
      setConversations(defaultContextValue.conversations);
      setConvoMessages(defaultContextValue.convoMessages);
      return;
    }

    (async () => {
      convoStreamRef.current = await xmtpClient.conversations.stream();
      convoStreamSub(xmtpClient.address, convoStreamRef.current);
    })();

    // eslint-disable-next-line consistent-return
    return () => {
      closeStream();
    };
  }, [xmtpClient]);

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

    if (!xmtpClient) {
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
  }, [conversations, xmtpClient]);

  const startNewConvo: StartNewConvoAction = useCallback(
    async (convoAddress, opts) => {
      try {
        if (!xmtpClient) {
          throw new Error('Please connect to an XMTP account');
        }
        const isOnNetwork = await xmtpClient.canMessage(convoAddress);
        if (!isOnNetwork) {
          throw new Error(
            "Recipient hasn't created an XMTP identity and can't receive messages"
          );
        }
        const convo = await xmtpClient.conversations.newConversation(
          convoAddress
        );
        await convo.send('hi');
        opts?.onSuccess?.();
        setSelectedConvoAddress(convoAddress);
      } catch (error) {
        opts?.onFail?.(error);
      }
    },
    [xmtpClient]
  );

  const sendMessage: SendMessageAction = useCallback(
    async (convoAddress: string, message: string, opts) => {
      if (!convoAddress) {
        return;
      }
      try {
        if (!xmtpClient) {
          throw new Error('Please connect to an XMTP account');
        }
        const conversation = await xmtpClient.conversations.newConversation(
          convoAddress
        );
        await conversation.send(message);
        opts?.onSuccess?.();
      } catch (error) {
        opts?.onFail?.(error);
      }
    },
    [xmtpClient]
  );

  return (
    <XmtpConversationsContext.Provider
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
    </XmtpConversationsContext.Provider>
  );
}

export const useXmtpConversations = () => {
  const ctx = useContext(XmtpConversationsContext);
  if (!ctx) {
    throw new Error(
      'useXmtpConversations must be used within XmtpConversationsContextProvider'
    );
  }
  return ctx;
};
