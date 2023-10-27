import { useMemo } from 'react';
import { useXmtpStore } from '../../../contexts/message/XmtpStoreCtx';
import { getLatestMessage } from '../../../utils/message/xmtp';

export default function useConversationList() {
  const { conversations, convoMessages, loadingConversations } = useXmtpStore();
  const sortedMessages = useMemo(
    () =>
      new Map(
        [...convoMessages.entries()].sort((convoA, convoB) => {
          return getLatestMessage(convoA[1])?.sent <
            getLatestMessage(convoB[1])?.sent
            ? 1
            : -1;
        })
      ),
    [convoMessages]
  );

  const conversationList = useMemo(
    () =>
      Array.from(sortedMessages.keys())
        .filter((address) => !!conversations.get(address))
        .map((address) => {
          const conversation = conversations.get(address);
          const messages = sortedMessages.get(address) || [];
          const latestMessage = getLatestMessage(messages);
          return { conversation, messages, latestMessage };
        }),
    [sortedMessages, conversations]
  );

  return {
    isLoading: loadingConversations,
    conversationList,
  };
}
