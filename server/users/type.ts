import { Document } from 'mongoose'
import { Params, ParamsDictionary, Request } from 'express-serve-static-core'

export interface IUser extends Document {
  userName: string
  password: string
}

export interface IUserJWTPayload {
  id: string
  userName: string
}

export type RequestUser<P extends Params = ParamsDictionary> = Request<P> & {
  user: IUserJWTPayload
}
