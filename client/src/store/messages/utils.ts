import { ChatMessage, ItemType } from '~/store/messages/type'
import { IViewMessage } from 'server/src/message/type'

export const messageToChatItem = (messages: IViewMessage): ChatMessage => {
  return {
    ...messages,
    type: ItemType.Message,
  }
}
