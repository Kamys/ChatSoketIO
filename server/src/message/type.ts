import { Document } from 'mongoose'

export interface IMessage extends Document {
  creatorId: string
  chatId: string
  text: string
  createDate: string
  creatorName: string
}

export interface IViewMessage {
  id: string
  creatorId: string
  chatId: string
  text: string
  createDate: string
  creatorName: string
}
