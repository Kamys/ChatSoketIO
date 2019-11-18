import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Input, Message as MessageInfo } from 'semantic-ui-react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { ChatItem, ChatMessage, ChatNotification } from './type'
import Message from './Message'
import { formatChatDate } from './utils'
import MessageList from './MessageList'
import { useDidMount } from '../../hooks'
import chat from '../../chat'

type Props = {}

const ChatContainer = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const InputStyled = styled.div`
  width: 100%;
`

const Chat: React.FC<Props> = () => {
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
    event => {
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
  }, [messages, notifications])

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
    <ChatContainer>
      <MessageList chatItems={chatItems} />
      <Input
        as={InputStyled}
        value={message}
        onKeyDown={handleKeyDown}
        onChange={event => setMessage(event.currentTarget.value)}
        action={{ icon: 'send', onClick: handlerSend }}
        placeholder="Write a messages..."
      />
    </ChatContainer>
  )
}

export default Chat
