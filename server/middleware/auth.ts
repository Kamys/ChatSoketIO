import jwt from 'jsonwebtoken'
import { RequestHandler } from 'express'
import config from '../config'
import { RequestUser } from '../type'

const auth: RequestHandler = (req: RequestUser, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization']
  if (!token) {
    res.status(401).send('Access denied. No token provided.')
    return
  }

  try {
    req.user = jwt.verify(token, config.myprivatekey)
    next()
  } catch (ex) {
    res.status(401).send('Invalid token.')
  }
}

export default auth
