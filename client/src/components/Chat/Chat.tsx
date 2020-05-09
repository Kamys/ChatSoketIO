import React from 'react'
import { Header, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem } from './type'
import MessageList from './MessageList'

const ChatContainer = styled.div`
  display: grid;
  grid-template-areas:
    'title'
    'content'
    'controls';
  grid-template-rows: 25px 1fr 70px;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  height: 100%;
  max-height: 100vh;
  padding: 10px;
`

const Title = styled.h3`
  &&& {
    grid-area: title;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`
const Content = styled.div`
  &&& {
    grid-area: content;
    min-width: 100%;
    padding-right: 10px;
    margin: 0;
    overflow: auto;
  }
`
const Controls = styled.div`
  grid-area: controls;
`

type Props = {
  items: ChatItem[]
  message: string
  title: string
  onChangeMessages: (messages: string) => void
  onSend: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

const Chat: React.FC<Props> = props => {
  const { items, message, title, onChangeMessages, onKeyDown, onSend } = props

  return (
    <ChatContainer>
      <Header as={Title} dividing>
        {title}
      </Header>
      <MessageList as={Content} chatItems={items} />
      <Input
        as={Controls}
        value={message}
        onKeyDown={onKeyDown}
        onChange={event => onChangeMessages(event.currentTarget.value)}
        action={{ icon: 'send', onClick: onSend }}
        placeholder="Write a messages..."
      />
    </ChatContainer>
  )
}

export default Chat
