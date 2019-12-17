import React, { useCallback, useMemo, useState } from 'react'
import { Message as MessageInfo } from 'semantic-ui-react'
import Chat from '../components/Chat/Chat'
import { ChatItem } from '../components/Chat/type'
import { useDidMount } from '../hooks'
import chat from '../chat'
import Message from '../components/Chat/Message'
import { formatChatDate } from '../components/Chat/utils'
import useChat from '../hooks/useChat'
import { ItemType } from '../store/messages/type'
import { useSelectedUser, useUser } from '../hooks/user'

type Props = {
  chatId: string
}

const ChatPersonal: React.FC<Props> = props => {
  const { chatId } = props
  const [message, setMessage] = useState<string>('')
  const { messages, sendMessages } = useChat(chatId)

  const { account } = useUser()
  const selectedUser = useSelectedUser()

  useDidMount(() => {
    chat.init()
  })

  const handlerSend = useCallback(() => {
    sendMessages(message)
    setMessage('')
  }, [message, sendMessages])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        chat.sendMessage({ chatId, msg: message })
        setMessage('')
      }
    },
    [chatId, message]
  )

  const chatItems = useMemo<ChatItem[]>(() => {
    const messageNodes = messages.map(message => {
      if (message.type === ItemType.Message) {
        return {
          id: message.id,
          dataCreated: message.dateCreated,
          reactNode: (
            <Message
              id={message.id}
              isYour={message.userName === account.name}
              dataCreated={formatChatDate(message.dateCreated)}
              text={message.text}
              name={message.userName}
              userAvatar={message.userAvatar}
            />
          ),
        }
      }

      if (message.type === ItemType.Notification) {
        return {
          id: message.id,
          dataCreated: message.dateCreated,
          reactNode: <MessageInfo positive>{message.text}</MessageInfo>,
        }
      }

      console.error('Failed show messages: ', message)
      
      return {
        id: null,
        dataCreated: null,
        reactNode: <div>Failed display messages. Unknown type</div>
      }
    })

    return messageNodes.sort((first, second) => {
      const firstTime = new Date(first.dataCreated).valueOf()
      const secondTime = new Date(second.dataCreated).valueOf()
      return firstTime - secondTime
    })
  }, [account.name, messages])

  return (
    <Chat
      title={selectedUser.name}
      items={chatItems}
      message={message}
      onKeyDown={handleKeyDown}
      onChangeMessages={setMessage}
      onSend={handlerSend}
    />
  )
}

export default ChatPersonal
