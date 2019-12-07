import { Document } from 'mongoose'

export interface IChat extends Document {
  name: string
  memberIds: string[]
}

export interface IViewChat {
  id: string
  memberIds: string[]
}
