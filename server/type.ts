import { Params, ParamsDictionary, Request } from 'express-serve-static-core'
import { IUserJWTPayload } from './users/type'

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

export type RequestUser<P extends Params = ParamsDictionary> = Request<P> & {
  user: IUserJWTPayload
}

/**
 * Without user
 */
export interface UnAuthRequest<T = {}> extends Request {
  body: T
}

/**
 * With user
 */
export type UserRequest<T = {}, P = {}> = Merge<
  RequestUser,
  {
    body: T
    query: P
  }
>
