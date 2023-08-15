import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Conversation, DecodedMessage, Stream } from '@xmtp/xmtp-js'
import { useXmtpClient } from './XmtpClientCtx'

interface XmtpStoreCtxValue {
  conversations: Map<string, Conversation>
  convoMessages: Map<string, DecodedMessage[]>
  loadingConversations: boolean
  loadConversations: () => void
  currentConvoAddress: string
  setCurrentConvoAddress: (convo: string) => void
}

const defaultContextValue: XmtpStoreCtxValue = {
  conversations: new Map(),
  convoMessages: new Map(),
  loadingConversations: false,
  loadConversations: () => {},
  currentConvoAddress: '',
  setCurrentConvoAddress: () => {},
}

export const XmtpStoreCtx = createContext(defaultContextValue)

export function XmtpStoreProvider({ children }: PropsWithChildren) {
  const { xmtpClient } = useXmtpClient()

  const [conversations, setConversations] = useState(
    defaultContextValue.conversations,
  )

  const [convoMessages, setConvoMessages] = useState(
    defaultContextValue.convoMessages,
  )

  const [loadingConversations, setLoadingConversations] = useState(false)

  const [currentConvoAddress, setCurrentConvoAddress] = useState(
    defaultContextValue.currentConvoAddress,
  )

  const loadConversations = useCallback(async () => {
    if (!xmtpClient) {
      setConversations(defaultContextValue.conversations)
      return
    }
    try {
      setLoadingConversations(true)
      const convos = (await xmtpClient.conversations.list()).filter(
        (conversation) => !conversation.context?.conversationId,
      )
      const convoMessagesMap = new Map()
      await Promise.all(
        convos
          .filter((convo) => convo.peerAddress !== xmtpClient.address)
          .map(async (convo) => {
            const messages = await convo.messages()
            convoMessagesMap.set(convo.peerAddress, messages)
          }),
      )

      const convosMap = new Map(convos.map((c) => [c.peerAddress, c]))

      setConversations(convosMap)
      setConvoMessages(convoMessagesMap)
    } catch (error) {
      setConversations(defaultContextValue.conversations)
      setConvoMessages(defaultContextValue.convoMessages)
    } finally {
      setLoadingConversations(false)
    }
  }, [xmtpClient])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const streamConvoRef = useRef<Stream<Conversation> | null>(null)
  const streamConvoSub = useCallback(
    async (clientAddress: string, stream: Stream<Conversation>) => {
      for await (const convo of stream) {
        if (convo.peerAddress !== clientAddress) {
          const messages = await convo.messages()
          setConversations((prev) => {
            const newConversations = new Map(prev)
            newConversations.set(convo.peerAddress, convo)
            return newConversations
          })
          setConvoMessages((prev) => {
            const newConvoMessages = new Map(prev)
            newConvoMessages.set(convo.peerAddress, messages)
            return newConvoMessages
          })
        }
      }
    },
    [],
  )
  useEffect(() => {
    const closeStreamConvo = async () => {
      if (!streamConvoRef.current) return
      await streamConvoRef.current.return()
      streamConvoRef.current = null
    }
    if (!xmtpClient) {
      closeStreamConvo()
      setConversations(defaultContextValue.conversations)
      setConvoMessages(defaultContextValue.convoMessages)
      return
    }

    ;(async () => {
      streamConvoRef.current = await xmtpClient.conversations.stream()
      streamConvoSub(xmtpClient.address, streamConvoRef.current)
    })()
    return () => {
      closeStreamConvo()
    }
  }, [xmtpClient, streamConvoSub])

  const streamMessagesRef = useRef<Map<string, Stream<DecodedMessage>>>(
    new Map(),
  )
  const streamMessagesSub = useCallback(
    async (address: string, stream: Stream<DecodedMessage>) => {
      for await (const msg of stream) {
        setConvoMessages((prev) => {
          const prevConvoMessages = new Map(prev)
          const newMessages = prevConvoMessages.get(address) ?? []
          newMessages.push(msg)
          const uniqueMessages = [
            ...Array.from(
              new Map(newMessages.map((item) => [item.id, item])).values(),
            ),
          ]
          prevConvoMessages.set(address, uniqueMessages)
          return prevConvoMessages
        })
      }
    },
    [],
  )
  useEffect(() => {
    const closeStreamMessages = async () => {
      if (!streamMessagesRef.current.size) return
      for (const stream of streamMessagesRef.current.values()) {
        await stream.return()
      }
      streamMessagesRef.current.clear()
    }

    if (!xmtpClient) {
      closeStreamMessages()
      return
    }

    ;(async () => {
      for (const convo of conversations.values()) {
        if (streamMessagesRef.current.has(convo.peerAddress)) continue
        const stream = await convo.streamMessages()
        streamMessagesRef.current.set(convo.peerAddress, stream)
      }
      for (const [address, stream] of streamMessagesRef.current.entries()) {
        streamMessagesSub(address, stream)
      }
    })()

    return () => {
      closeStreamMessages()
    }
  }, [conversations, xmtpClient, streamMessagesSub])

  return (
    <XmtpStoreCtx.Provider
      value={useMemo(
        () => ({
          conversations,
          convoMessages,
          loadingConversations,
          loadConversations,
          currentConvoAddress,
          setCurrentConvoAddress,
        }),
        [
          conversations,
          convoMessages,
          loadingConversations,
          loadConversations,
          currentConvoAddress,
          setCurrentConvoAddress,
        ],
      )}
    >
      {children}
    </XmtpStoreCtx.Provider>
  )
}

export const useXmtpStore = () => {
  const ctx = useContext(XmtpStoreCtx)
  if (!ctx) {
    throw new Error('useXmtpStore must be used within XmtpStoreProvider')
  }
  return ctx
}
