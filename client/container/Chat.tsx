import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Chat from '../components/Chat/Chat'
import {
  ChatItem,
  ChatMessage,
  ChatNotification,
} from '../components/Chat/type'
import { useParams } from 'react-router'
import { useDidMount } from '../hooks'
import chat from '../chat'
import Message from '../components/Chat/Message'
import { formatChatDate } from '../components/Chat/utils'
import { Message as MessageInfo } from 'semantic-ui-react'

type Props = {}

export const ChatPersonal: React.FC<Props> = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notifications, setNotification] = useState<ChatNotification[]>([])
  const { chatId } = useParams<{ chatId: string }>()

  useDidMount(() => {
    chat.init()
  })

  const handlerSend = useCallback(() => {
    chat.sendMessage({ to: chatId, msg: message })
    setMessage('')
  }, [chatId, message])

  useDidMount(() => {})

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        chat.sendMessage({ to: chatId, msg: message })
        setMessage('')
      }
    },
    [chatId, message]
  )

  useEffect(() => {
    chat.handleSendMessage(({ name, msg }) => {
      if (name !== chatId) {
        return
      }
      setMessages([
        ...messages,
        {
          id: new Date().valueOf().toString(),
          text: msg,
          dataCreated: new Date().toString(),
          userAvatar:
            'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
          name: name,
        },
      ])
    })

    chat.handleSendInfo(msg => {
      setNotification([
        ...notifications,
        {
          id: new Date().valueOf().toString(),
          dataCreated: new Date().toString(),
          text: msg,
          isPositive: true,
        },
      ])
    })

    return chat.closeAllHandler
  }, [chatId, messages, notifications])

  const chatItems = useMemo<ChatItem[]>(() => {
    const messageNodes = messages.map(message => ({
      id: message.id,
      dataCreated: message.dataCreated,
      reactNode: (
        <Message
          id={message.id}
          dataCreated={formatChatDate(message.dataCreated)}
          text={message.text}
          name={message.name}
          userAvatar={message.userAvatar}
        />
      ),
    }))

    const notificationsNodes = notifications.map(notification => ({
      id: notification.id,
      dataCreated: notification.dataCreated,
      reactNode: <MessageInfo positive>{notification.text}</MessageInfo>,
    }))

    return [...messageNodes, ...notificationsNodes].sort((first, second) => {
      const firstTime = new Date(first.dataCreated).valueOf()
      const secondTime = new Date(second.dataCreated).valueOf()
      return firstTime - secondTime
    })
  }, [messages, notifications])

  return (
    <Chat
      items={chatItems}
      onKeyDown={handleKeyDown}
      message={message}
      onChangeMessages={setMessage}
      onSend={handlerSend}
    />
  )
}
