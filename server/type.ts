import { Request } from 'express-serve-static-core'

export interface CustomRequest<T> extends Request {
  body: T
}
