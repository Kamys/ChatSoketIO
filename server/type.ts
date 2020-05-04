import {
  NextFunction,
  Params,
  ParamsDictionary,
  Request,
  Response,
} from 'express-serve-static-core'
import { IUserJWTPayload } from './users/type'
import { IDictionary } from 'client/type'

type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

/**
 * Body - Request body
 * Query - Request query
 * P - Request params
 * ResBody - Response body
 */
export type RequestUser<
  Body = {},
  Query = {},
  P extends Params = ParamsDictionary,
  ResBody = {},
> = Merge<Request<P, ResBody, Body>, {
  user: IUserJWTPayload
  query: Query
}>

/**
 * Request without user data
 */
export type UnAuthRequest<T = {}> = Request<ParamsDictionary, any, T>

/**
 * With files
 * B - body
 * Q - query
 */
export type RequestFiles = Merge<RequestUser, {
  files: IDictionary<File>
}>

/**
 * Handle request
 * B - type for request
 */
export type HR<R, P extends Params = ParamsDictionary, ResBody = any, ReqBody = any> = {
  (req: R, res: Response<ResBody>, next: NextFunction): any;
}

/**
 * Handle UserRequest
 * B - body
 * Q - query
 */
export type HUR<B = {}, Q = {}> = HR<RequestUser<B, Q>>
