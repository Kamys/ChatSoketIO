import { ChatMessage, ItemType } from 'client/store/messages/type'
import { IViewMessage } from 'server/message/type'

export const messageToChatItem = (messages: IViewMessage): ChatMessage => {
  return {
    ...messages,
    type: ItemType.Message,
  }
}
