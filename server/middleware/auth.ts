import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import config from '../config'
import { RequestUser } from '../type'

const auth: RequestHandler = (req: RequestUser, res, next) => {
  console.log('req.headers: ', req.headers)
  const tokenString = req.headers.authorization as string
  if (!tokenString) {
    res.status(401).send('Access denied. No token provided.')
    return
  }

  const token = tokenString.replace('Bearer ', '')
  try {
    req.user = jwt.verify(token, config.myprivatekey)
    next()
  } catch (ex) {
    res.status(401).send('Invalid token.')
  }
}

export default auth
