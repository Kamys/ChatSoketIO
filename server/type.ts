import { Params, ParamsDictionary, Request } from 'express-serve-static-core'
import { IUserJWTPayload } from './models/user.model'

export type RequestUser<P extends Params = ParamsDictionary> = Request<P> & {
  user: IUserJWTPayload
}

export interface CustomRequest<T> extends Request {
  body: T
}
