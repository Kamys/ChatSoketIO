import { ChatMessage, ItemType } from 'client/store/messages/type'
import { IViewMessage } from 'server/message/type'

export const messageToChatItem = (messages: IViewMessage): ChatMessage => {
  return {
    ...messages,
    userAvatar: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
    type: ItemType.Message,
  }
}
