import { ChatMessage, ItemType } from 'client/src/store/messages/type'
import { IViewMessage } from 'server/src/message/type'

export const messageToChatItem = (messages: IViewMessage): ChatMessage => {
  return {
    ...messages,
    type: ItemType.Message,
  }
}
