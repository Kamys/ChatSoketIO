import { Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  password: string
}

export interface IViewUser {
  id: string
  name: string
}

export interface IUserJWTPayload {
  id: string
  name: string
}
