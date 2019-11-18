import { Document } from 'mongoose'
import { Params, ParamsDictionary, Request } from 'express-serve-static-core'

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

export type RequestUser<P extends Params = ParamsDictionary> = Request<P> & {
  user: IUserJWTPayload
}
