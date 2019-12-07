import { useCallback, useEffect } from 'react'
import chat from '../chat'
import Message from '../store/messages'
import { useStore } from 'effector-react'
import { IDictionary } from '../type'
import { ChatElement, ItemType } from '../store/messages/type'

const useChat = (chatId: string) => {
  const storeMessage: IDictionary<Array<ChatElement>> = useStore(Message.store)

  useEffect(() => {
    chat.handleSendMessage(({ userName, text }) => {
      Message.receiveMessage({
        id: new Date().valueOf().toString(),
        text,
        dateCreated: new Date().toString(),
        userAvatar:
          'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
        userName,
        type: ItemType.Message,
        chatId,
      })
    })

    chat.handleSendInfo(msg => {
      Message.receiveMessage({
        id: new Date().valueOf().toString(),
        dateCreated: new Date().toString(),
        text: msg,
        isPositive: true,
        type: ItemType.Notification,
        chatId,
      })
    })

    return chat.closeAllHandler
  }, [chatId])

  const sendMessages = useCallback((message: string) => {
    chat.sendMessage({ chatId: chatId, msg: message })
  }, [chatId])

  return { sendMessages, messages: storeMessage[chatId] || [] }
}

export default useChat
