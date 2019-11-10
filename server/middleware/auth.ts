import { RequestHandler } from 'express'
import { RequestUser } from '../type'
import { verifyAuthToken } from '../models/user.model'
import { SERVER_ERROR } from '../constants/error'

const auth: RequestHandler = (req: RequestUser, res, next) => {
  const tokenString = req.headers.authorization as string
  if (!tokenString) {
    res.status(401).send('Access denied. No token provided.')
    return
  }

  const token = tokenString.replace('Bearer ', '')
  try {
    req.user = verifyAuthToken(token)
    next()
  } catch (ex) {
    res.status(401).send(SERVER_ERROR.ACCESS_TOKEN_INVALID)
  }
}

export default auth
