export enum ItemType {
  Message = 'Message',
  Notification = 'Notification',
}

export type ChatItem = {
  id: string
  type: ItemType
  chatId: string
  dateCreated: string
}

export type ChatMessage = ChatItem & {
  text: string
  userAvatar: string
  userName: string
  type: ItemType.Message
}

export type ChatInfo = ChatItem & {
  text: string
  isPositive: true,
  type: ItemType.Notification
}

export type ChatElement = ChatMessage | ChatInfo

