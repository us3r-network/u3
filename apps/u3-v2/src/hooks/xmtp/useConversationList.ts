import { useMemo } from 'react'
import { useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx'
import { getLatestMessage } from '../../utils/xmtp'
import { Conversation } from '@xmtp/xmtp-js'

export default function useConversationList() {
  const { conversations, convoMessages, loadingConversations } = useXmtpStore()
  const sortedMessages = useMemo(
    () =>
      new Map(
        [...convoMessages.entries()].sort((convoA, convoB) => {
          return (getLatestMessage(convoA[1])?.sent as Date) <
            (getLatestMessage(convoB[1])?.sent as Date)
            ? 1
            : -1
        }),
      ),
    [convoMessages],
  )

  const conversationList = useMemo(
    () =>
      Array.from(sortedMessages.keys())
        .filter((address) => !!conversations.get(address))
        .map((address) => {
          const conversation = conversations.get(address) as Conversation
          const messages = sortedMessages.get(address) || []
          const latestMessage = getLatestMessage(messages)
          return { conversation, messages, latestMessage }
        }),
    [sortedMessages, conversations],
  )

  return {
    isLoading: loadingConversations,
    conversationList,
  }
}
