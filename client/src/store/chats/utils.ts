import isEqual from 'lodash/isEqual'

import { Chat } from './type'

export const getChatByMember = (chats: Chat[], memberIds: string[]): Chat | undefined => {
  return chats.find(chat => isEqual(chat.memberIds.sort(), memberIds.sort()))
}
