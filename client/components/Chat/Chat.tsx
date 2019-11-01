import React, { useMemo, useState } from 'react'
import socketIOClient from 'socket.io-client'
import {
  Button,
  Comment,
  Header,
  Input,
  Message as MessageInfo,
} from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem, ChatMessage, ChatNotification } from './type'
import Message from './Message'
import { formatChatDate } from './utils'
import './Chat.css'

interface IProps {}

const CommentStyled = styled.div`
  width: 100%;
`
const InputStyled = styled.div`
  width: 100%;
`

const socket = socketIOClient()

const Chat: React.FC<IProps> = () => {
  const [isChatStart, setIsChatStart] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [notifications, setNotification] = useState<ChatNotification[]>([])

  const handlerSend = () => {
    socket.emit('sendMessage', message)
    setMessage('')
  }

  const handlerStartChat = () => {
    socket.emit('initUser', { userName })
    setIsChatStart(true)
  }

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      socket.emit('sendMessage', message)
      setMessage('')
    }
  }

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

  if (!isChatStart) {
    return (
      <div>
        Enter user name:{' '}
        <input onChange={event => setUserName(event.target.value)} />
        <Button disabled={userName.length === 0} onClick={handlerStartChat}>
          Start chat
        </Button>
      </div>
    )
  }

  console.log('Chat render')

  return (
    <div className={'chat'}>
      <Comment.Group as={CommentStyled}>
        <Header as="h3" dividing>
          Main chat
        </Header>
        {chatItems.map(chatItem => (
          <React.Fragment key={chatItem.id}>
            {chatItem.reactNode}
          </React.Fragment>
        ))}
      </Comment.Group>
      <Input
        as={InputStyled}
        value={message}
        onKeyDown={handleKeyDown}
        onChange={event => setMessage(event.currentTarget.value)}
        action={{ icon: 'send', onClick: handlerSend }}
        placeholder="Write a messages..."
      />
    </div>
  )
}

export default Chat
