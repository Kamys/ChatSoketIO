import { Params, ParamsDictionary, Request } from 'express-serve-static-core'
import { IUser } from './models/user.model'

export type RequestUser<P extends Params = ParamsDictionary> = Request<P> & {
  user: IUser
}

export interface CustomRequest<T> extends Request {
  body: T
}
