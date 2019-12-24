export enum ItemType {
  Message = 'Message',
  Notification = 'Notification',
}

export type ChatItem = {
  id: string
  type: ItemType
  chatId: string
  createDate: string
}

export type ChatMessage = ChatItem & {
  creatorId: string
  chatId: string
  text: string
  creatorName: string
  userAvatar: string
}

export type ChatInfo = ChatItem & {
  text: string
  isPositive: true,
  type: ItemType.Notification
}

export type ChatElement = ChatMessage | ChatInfo

