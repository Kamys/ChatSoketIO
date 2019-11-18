import { ReactNode } from 'react'

export type ChatItem = {
  id: string
  reactNode: ReactNode
  dataCreated: string
}

export type ChatMessage = {
  id: string
  text: string
  name: string
  userAvatar: string
  dataCreated: string
}

export type ChatNotification = {
  id: string
  text: string
  isPositive: boolean
  dataCreated: string
}

export enum ChatItemType {
  Message = 'Message',
  Notification = 'Notification',
}
