import { Document } from 'mongoose'

export interface IMessage extends Document {
  creatorId: string
  chatId: string
  text: string
  createDate: string
}

export interface IViewMessages {
  id: string
  creatorId: string
  chatId: string
  text: string
  createDate: string
}
