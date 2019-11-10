import React, { useCallback, useEffect, useMemo, useState } from 'react'
import socketIOClient from 'socket.io-client'
import { Input, Message as MessageInfo } from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem, ChatMessage, ChatNotification } from './type'
import Message from './Message'
import { formatChatDate } from './utils'
import MessageList from './MessageList'
import { useDidMount } from '../../hooks'
import { getToken } from '../../api/utils'
import user from '../../store/user'

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

const socketUrl = 'http://localhost:3000'
const socket = socketIOClient(socketUrl, {
  autoConnect: false,
})

const Chat: React.FC<Props> = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notifications, setNotification] = useState<ChatNotification[]>([])

  const handlerSend = useCallback(() => {
    socket.emit('sendMessage', message)
    setMessage('')
  }, [message])

  useDidMount(() => {
    socket.on('connect', () => {
      socket.emit('authentication', {
        token: getToken(),
      })
    })

    socket.on('authenticated', reason => {
      console.log('Authenticated:', reason)
    })

    socket.on('unauthorized', reason => {
      console.log('Unauthorized:', reason)
      user.logout()
      socket.disconnect()
    })

    socket.on('disconnect', reason => {
      console.log(`Disconnected: ${reason}`)
    })

    socket.open()
  })

  const handleKeyDown = useCallback(
    event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        socket.emit('sendMessage', message)
        setMessage('')
      }
    },
    [message]
  )

  useEffect(() => {
    socket.on('sendMessage', ({ userName, msg }) => {
      setMessages([
        ...messages,
        {
          id: new Date().valueOf().toString(),
          text: msg,
          dataCreated: new Date().toString(),
          userAvatar:
            'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
          userName: userName,
        },
      ])
    })

    socket.on('info', msg => {
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

    return () => {
      socket.off('sendMessage')
      socket.off('info')
    }
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
          userName={message.userName}
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
