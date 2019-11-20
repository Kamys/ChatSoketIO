import React from 'react'
import { Input } from 'semantic-ui-react'
import styled from 'styled-components'
import { ChatItem } from './type'
import MessageList from './MessageList'

type Props = {
  items: ChatItem[]
  message: string
  onChangeMessages: (messages: string) => void
  onSend: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

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

const Chat: React.FC<Props> = props => {
  const { items, message, onChangeMessages, onKeyDown, onSend } = props

  return (
    <ChatContainer>
      <MessageList chatItems={items} />
      <Input
        as={InputStyled}
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
